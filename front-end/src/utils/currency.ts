import { selectedCurrency } from '@/constants/signals.ts'
import { Currency, currencyDetails } from '@/constants/currencies.ts'

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

export function formatTotalForCurrency(total: number, currency: keyof typeof Currency) {
  const formattedTotal = convertUsdToCurrency(total).toFixed(2)
  if ([Currency.Euro, Currency.JapaneseYen, Currency.UnitedStatesDollar].includes(currency)) {
    return currencyDetails[currency].symbol + formattedTotal
  }

  return formattedTotal
}
