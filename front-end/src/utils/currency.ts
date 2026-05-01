import { selectedCurrency } from '@/signals.ts'
import { Currency, currencyDetails } from '@/constants/currencies.ts'
import { log } from '@/utils/console.ts'
import { LocalStorageItems } from '@/constants/local-storage.ts'

/**
 * Converts an amount of money from the selected currency to USD.
 *
 * @param amount The amount of money to convert.
 */
export function convertCurrencyToUsd(amount: number) {
  if (amount === 0) {
    return 0
  }

  return amount * getCurrencyConversionRates(selectedCurrency.get()).toUsd
}

/**
 * Converts an amount in USD to the selected currency using the current conversion rate.
 *
 * @param {number} amount - The amount in USD to be converted. Should be a non-negative value.
 * @return {number} The equivalent amount in the specified currency. Returns 0 if the input amount is 0.
 */
export function convertUsdToCurrency(amount: number) {
  if (amount === 0) {
    return 0
  }

  return amount * getCurrencyConversionRates(selectedCurrency.get()).fromUsd
}

/**
 * Formats a given total amount into the specified currency.
 *
 * @param {number} total - The total amount in USD to be formatted.
 * @param {keyof typeof Currency} currency - The currency key for the desired format.
 * @return {string} The formatted total as a string with the appropriate currency symbol.
 */
export function formatTotalForCurrency(total: number, currency: keyof typeof Currency) {
  const formattedTotal = convertUsdToCurrency(total).toFixed(2)
  return currencyDetails[currency].symbol + formattedTotal
}

/**
 * Retrieves the conversion rates for the specified currency.
 *
 * @param {keyof typeof Currency} currency - The currency for which conversion rates should be retrieved.
 * @return {number} The conversion rate of the specified currency.
 */
export function getCurrencyConversionRates(currency: keyof typeof Currency) {
  if (localStorage.getItem(LocalStorageItems.ExchangeRates)) {
    const storedData = JSON.parse(localStorage.getItem(LocalStorageItems.ExchangeRates)!)
    return storedData.rates[currency]
  }

  return currencyDetails[currency].conversionRate
}

/**
 * Updates the currency conversion rates by fetching the latest data from the Frankfurter API
 * or utilizing locally stored data if available and valid. The method synchronizes conversion
 * rates from USD to other currencies and vice versa, storing the updated rates in local storage.
 *
 * @param {boolean} [skipLocalStorageCheck=false] - If true, bypasses the check for local storage
 *                                                  and fetches data directly from the API.
 * @return {Promise<void>} A promise that resolves when the currency conversion rates have been updated.
 */
export async function updateCurrencyConversionRates(skipLocalStorageCheck = false) {
  // If data is found in local storage, use that if it is within a week old
  if (localStorage.getItem(LocalStorageItems.ExchangeRates) && !skipLocalStorageCheck) {
    const storedData = JSON.parse(localStorage.getItem(LocalStorageItems.ExchangeRates)!)
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const isPastTimeLime = new Date(storedData.lastUpdated).getTime() > oneWeekAgo

    const currencyKeysMatch = Object.keys(currencyDetails).join() == Object.keys(storedData.rates).join()

    if (isPastTimeLime && currencyKeysMatch) {
      log('Using exchange rates from local storage')
      return
    }
  }

  log('Fetching exchange rates from Frankfurter API')
  const countries = Object.values(Currency)
    .filter((currency) => currency !== Currency.UnitedStatesDollar)
    .join(',')
  const [
    fromUsdDataResponse,
    cadToUsdDataResponse,
    eurToUsdDataResponse,
    jpyToUsdDataResponse,
    myrToUsdDataResponse,
    sgdToUsdDataResponse,
  ] = await Promise.all([
    fetch(`https://api.frankfurter.dev/v2/rates?base=USD&quotes=${countries}`),
    fetch(`https://api.frankfurter.dev/v2/rate/CAD/USD`),
    fetch(`https://api.frankfurter.dev/v2/rate/EUR/USD`),
    fetch(`https://api.frankfurter.dev/v2/rate/JPY/USD`),
    fetch(`https://api.frankfurter.dev/v2/rate/MYR/USD`),
    fetch(`https://api.frankfurter.dev/v2/rate/SGD/USD`),
  ])

  let fromUsdDataLookup: Record<string, number> = {}
  if (fromUsdDataResponse.ok) {
    const fromUsdData = await fromUsdDataResponse.json()
    fromUsdDataLookup = Object.fromEntries(
      fromUsdData.map((item: { quote: string; rate: number }) => [item.quote, item.rate])
    )
    console.log('reponse', fromUsdDataResponse, fromUsdData, fromUsdDataLookup)
  }
  const toUsdDataLookup: Record<string, number> = {}
  if (cadToUsdDataResponse.ok) {
    const cadToUsdData = await cadToUsdDataResponse.json()
    toUsdDataLookup[Currency.CanadianDollar] = cadToUsdData.rate
    console.log('reponse', cadToUsdDataResponse, cadToUsdData)
  }
  if (eurToUsdDataResponse.ok) {
    const eurToUsdData = await eurToUsdDataResponse.json()
    toUsdDataLookup[Currency.Euro] = eurToUsdData.rate
    console.log('reponse', eurToUsdDataResponse, eurToUsdData)
  }
  if (jpyToUsdDataResponse.ok) {
    const jpyToUsdData = await jpyToUsdDataResponse.json()
    toUsdDataLookup[Currency.JapaneseYen] = jpyToUsdData.rate
    console.log('reponse', jpyToUsdDataResponse, jpyToUsdData)
  }
  if (myrToUsdDataResponse.ok) {
    const myrToUsdData = await myrToUsdDataResponse.json()
    toUsdDataLookup[Currency.MalaysianRinggit] = myrToUsdData.rate
    console.log('reponse', myrToUsdDataResponse, myrToUsdData)
  }
  if (sgdToUsdDataResponse.ok) {
    const sgdToUsdData = await sgdToUsdDataResponse.json()
    toUsdDataLookup[Currency.SingaporeDollar] = sgdToUsdData.rate
    console.log('reponse', sgdToUsdDataResponse, sgdToUsdData)
  }

  log('stuff', fromUsdDataLookup, toUsdDataLookup)

  const currencyData: Record<string, { fromUsd: number; toUsd: number }> = {}
  Object.values(Currency).map((currency) => {
    currencyData[currency] = {
      fromUsd: fromUsdDataLookup[currency] || currencyDetails[currency].conversionRate.fromUsd,
      toUsd: toUsdDataLookup[currency] || currencyDetails[currency].conversionRate.toUsd,
    }
  })

  // Store data in local storage
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem(LocalStorageItems.ExchangeRates, JSON.stringify({ lastUpdated: today, rates: currencyData }))
}
