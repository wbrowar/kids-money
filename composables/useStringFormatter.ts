export const useStringFormatter = () => {
  function convertToLocalCurrency (value = 0) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })

    return formatter.format(value)
  }

  return {
    convertToLocalCurrency
  }
}
