import { selectedCurrency } from '@/constants/signals.ts'
import { currencyDetails } from '@/constants/currencies.ts'
import { Currency } from 'types'

export function convertCurrencyToUsd(amount: number) {
  if (amount === 0) {
    return 0
  }

  return amount * currencyDetails[selectedCurrency.get()].conversionRate.toUsd
}

export function convertUsdToCurrency(amount: number) {
  if (amount === 0) {
    return 0
  }

  return amount * currencyDetails[selectedCurrency.get()].conversionRate.fromUsd
}

export function formatTotalForCurrency(total: number, currency: Currency) {
  const formattedTotal = convertUsdToCurrency(total).toFixed(2)
  if ([Currency.Euro, Currency.JapaneseYen, Currency.UnitedStatesDollar].includes(currency)) {
    return currencyDetails[currency].symbol + formattedTotal
  }

  return formattedTotal
}
