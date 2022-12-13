import { Kid } from '~/types'

export const useStringFormatter = () => {
  function convertToLocalCurrency (value = 0, options: { signDisplay?: string } = {}) {
    const formatterOptions = {
      currency: 'USD',
      style: 'currency'
    }

    Object.assign(formatterOptions, options)

    const formatter = new Intl.NumberFormat('en-US', formatterOptions)

    return formatter.format(value)
  }

  function favoriteColor ({ kid, opacity = 1 }: {
    kid: Kid,
    opacity?: number
  }) {
    const color = kid.color ?? '180 0 255'

    return /\d+ \d+ \d+/g.test(color) ? `rgb(${color} / ${opacity})` : color
  }

  function formatUTCDate (date: Date) {
    if (typeof date === 'string') {
      date = new Date(date)
    }

    const newDate = date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })

    log('new dates', newDate)

    return newDate
  }

  return {
    convertToLocalCurrency,
    favoriteColor,
    formatUTCDate
  }
}
