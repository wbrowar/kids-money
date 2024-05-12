/*
 * Change the currency and conversion rate for creating and displaying adjustments.
 */
import { Currency, currencyDetails } from '~/constants/currencies'

export const useCurrency = () => {
  const selectedCurrency = useCookie<Currency>('selected-currency', {
    default: () => Currency.UnitedStatesDollar
  })

  function convertCurrencyToUsd (amount: number) {
    if (amount === 0) {
      return 0
    }

    return amount * currencyDetails[selectedCurrency.value].conversionRate.toUsd
  }
  function convertUsdToCurrency (amount: number) {
    if (amount === 0) {
      return 0
    }

    return amount * currencyDetails[selectedCurrency.value].conversionRate.fromUsd
  }

  return {
    selectedCurrency,
    convertCurrencyToUsd,
    convertUsdToCurrency
  }
}
