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

    return newDate
  }

  function hexToRgb (hex = '#1FD22C') {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    return result
      ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
      : '0 0 0'
  }

  return {
    convertToLocalCurrency,
    favoriteColor,
    formatUTCDate,
    hexToRgb
  }
}
