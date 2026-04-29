/**
 * Currency codes used to convert from USD to selected currency.
 */
export const Currency: Record<string, string> = {
  CanadianDollar: 'CAD',
  Euro: 'EUR',
  JapaneseYen: 'JPY',
  MalaysianRinggit: 'MYR',
  SingaporeDollar: 'SGD',
  UnitedStatesDollar: 'USD',
}

// Last updated: 2026-04-29
export const currencyDetails = {
  [Currency.CanadianDollar]: {
    conversionRate: {
      fromUsd: 1.3659,
      toUsd: 0.73217,
    },
    symbol: 'C$',
    title: 'Canadian Dollar',
  },
  [Currency.Euro]: {
    conversionRate: {
      fromUsd: 0.85516,
      toUsd: 1.1694,
    },
    symbol: '€',
    title: 'Euro',
  },
  [Currency.JapaneseYen]: {
    conversionRate: {
      fromUsd: 159.76,
      toUsd: 0.00626,
    },
    symbol: '¥',
    title: 'Japanese Yen',
  },
  [Currency.MalaysianRinggit]: {
    conversionRate: {
      fromUsd: 3.9519,
      toUsd: 0.25304,
    },
    symbol: '',
    title: 'Malaysian Ringgit',
  },
  [Currency.SingaporeDollar]: {
    conversionRate: {
      fromUsd: 1.2768,
      toUsd: 0.78324,
    },
    symbol: '',
    title: 'Singapore Dollar',
  },
  [Currency.UnitedStatesDollar]: {
    conversionRate: {
      fromUsd: 1,
      toUsd: 1,
    },
    symbol: '$',
    title: 'United States Dollar',
  },
}
