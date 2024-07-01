export enum Currency {
  Euro= 'EUR',
  JapaneseYen = 'JPY',
  MalaysianRinggit = 'MYR',
  SingaporeDollar = 'SGD',
  UnitedStatesDollar = 'USD',
}

export const currencyDetails = {
  [Currency.Euro]: {
    conversionRate: {
      fromUsd: 0.93,
      toUsd: 1.07
    },
    symbol: '€',
    title: 'Euro'
  },
  [Currency.JapaneseYen]: {
    conversionRate: {
      fromUsd: 161.26,
      toUsd: 0.0062
    },
    symbol: '¥',
    title: 'Japanese Yen'
  },
  [Currency.MalaysianRinggit]: {
    conversionRate: {
      fromUsd: 4.713,
      toUsd: 0.21
    },
    symbol: 'MYR',
    title: 'Malaysian Ringgit'
  },
  [Currency.SingaporeDollar]: {
    conversionRate: {
      fromUsd: 1.36,
      toUsd: 0.74
    },
    symbol: 'SGD',
    title: 'Singapore Dollar'
  },
  [Currency.UnitedStatesDollar]: {
    conversionRate: {
      fromUsd: 1,
      toUsd: 1
    },
    symbol: '$',
    title: 'United States Dollar'
  }
}
