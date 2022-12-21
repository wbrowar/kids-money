import { Kid } from '~/types'

/*
 * Helper functions that format strings and take into account reactive data.
 */
export const useStringFormatter = () => {
  /*
   * Check to see if a color value is in the format:
   *
   * **`255 255 255`**
   *
   * ```
   * const { colorIsRgb } = useStringFormatter()
   *
   * if (colorIsRgb('0 255 0')) {
   *  // true
   * }
   *
   * if (colorIsRgb('#FF00FF')) {
   *  // false
   * }
   * ```
   */
  function colorIsRgb (color: string) {
    return /\d+ \d+ \d+/g.test(color)
  }

  /*
   * Converts an R, G, or B value to its hex equivalent.
   *
   * @param part An R, G, or B value between 0–255
   *
   * ```
   * componentToHex(100)
   * // 64
   * ```
   */
  function componentToHex (part: number) {
    const hex = part.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  /*
   * Displays number as a local currency (currently only as USD)
   *
   * @param value Number to convert.
   * @param options [Options to pass into the Intl.NumberFormat() call that does the currency translation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#using_options)
   *
   * ```
   * convertToLocalCurrency(10)
   * // 64
   * ```
   */
  function convertToLocalCurrency (value = 0, options: { signDisplay?: string } = {}) {
    const formatterOptions = {
      currency: 'USD',
      style: 'currency'
    }

    Object.assign(formatterOptions, options)

    const formatter = new Intl.NumberFormat('en-US', formatterOptions)

    return formatter.format(value)
  }

  /*
   * Takes the passed-in date and returns the seconds for one month in the future.
   * The returned value is good to use when setting a cookie.
   *
   * @param dateString A date string to start from. Leave this blank to start from today.
   *
   * ```
   * cookieExpirationDate('2022-12-25')
   * // 1643000400
   *
   * const loggedInCookie = useCookie<Record<string, any>>('logged-in', {
   *   maxAge: cookieExpirationDate()
   * })
   * ```
   */
  function cookieExpirationDate (dateString = '') {
    const now = dateString ?? false ? new Date(dateString) : new Date()
    const cookieExpirationDate = new Date(now.getFullYear(), (now.getMonth() + 1) % 12, now.getDate())
    return Math.round(cookieExpirationDate.getTime() / 1000)
  }

  /*
   * Display the color selected for a kid at different opacities.
   *
   * @param kid The Kid to get the favorite color from.
   * @param opacity Decimal between 0-1 that sets the opacity the color should be displayed at.
   *
   * ```
   * favoriteColor({ kid })
   * // 'rgb(180 0 255 / 1)'
   *
   *
   * favoriteColor({ kid, opacity: 0.5 })
   * // 'rgb(180 0 255 / 0.5)'
   * ```
   */
  function favoriteColor ({ kid, opacity = 1 }: {
    kid: Kid,
    opacity?: number
  }) {
    const color = kid.color ?? '180 0 255'

    return colorIsRgb(color) ? `rgb(${color} / ${opacity})` : color
  }

  /*
   * Format a UTC date for display on the front end.
   *
   * @param date The DateTime to format.
   *
   * ```
   * const date = new Date('2022-12-20T16:32:03.522Z')
   *
   * formatUTCDate(date)
   * // 'Dec 20, 2022, 11:32 AM' (when in EST timezone)
   * ```
   */
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

  /*
   * Converts a hex color value to format:
   *
   * **`255 255 255`**
   *
   * @param hex A hex color value to convert.
   *
   * ```
   * hexToRgb('0018D1')
   * // '0 24 209'
   * ```
   */
  function hexToRgb (hex = '#1FD22C') {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    return result
      ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
      : '0 0 0'
  }

  /*
   * Converts a hex color value to format:
   *
   * **`255 255 255`**
   *
   * @param r The red value, between 0-255, in an RGB color value.
   * @param g The green value, between 0-255, in an RGB color value.
   * @param b The blue value, between 0-255, in an RGB color value.
   *
   * ```
   * hexToRgb(0, 24, 209)
   * // '#0018D1'
   * ```
   */
  function rgbToHex (r: number, g: number, b: number) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
  }

  return {
    colorIsRgb,
    convertToLocalCurrency,
    cookieExpirationDate,
    favoriteColor,
    formatUTCDate,
    hexToRgb,
    rgbToHex
  }
}
