import { selectedCurrency } from '@/constants/signals.ts'
import { Currency, currencyDetails } from '@/constants/currencies.ts'
import { log } from '@/utils/console.ts'
import { LocalStorageItems } from '@/constants/local-storage.ts'

export function convertCurrencyToUsd(amount: number) {
  if (amount === 0) {
    return 0
  }

  return amount * getCurrencyConversionRates(selectedCurrency.get()).toUsd
}

export function convertUsdToCurrency(amount: number) {
  if (amount === 0) {
    return 0
  }

  return amount * getCurrencyConversionRates(selectedCurrency.get()).fromUsd
}

export function formatTotalForCurrency(total: number, currency: keyof typeof Currency) {
  const formattedTotal = convertUsdToCurrency(total).toFixed(2)
  return currencyDetails[currency].symbol + formattedTotal
}

export function getCurrencyConversionRates(currency: keyof typeof Currency) {
  if (localStorage.getItem(LocalStorageItems.ExchangeRates)) {
    const storedData = JSON.parse(localStorage.getItem(LocalStorageItems.ExchangeRates)!)
    return storedData.rates[currency]
  }

  return currencyDetails[currency].conversionRate
}

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
