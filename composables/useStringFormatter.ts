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

  return {
    convertToLocalCurrency
  }
}
