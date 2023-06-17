/*
 * Adds a dollar amount number to a total number.
 *
 * @param adjustment The dollar amount.
 * @param total The current total that the `adjustment` will be added to.
 *
 * ```
 * addDollarAdjustmentToTotal(5, 100)
 * // 105
 * ```
 */
export function addDollarAdjustmentToTotal (adjustment: number, total: number) {
  return adjustment + total
}

/*
 * Adds a percentage value to a total number.
 *
 * @param adjustment A percentage as a decimal.
 * @param total The current total that the `adjustment` will be added to.
 *
 * ```
 * addPercentAdjustmentToTotal(0.5, 100)
 * // 100.05
 * ```
 */
export function addPercentAdjustmentToTotal (adjustment: number, total: number) {
  return (adjustment * total) + total
}

/*
 * Calculates the dollar adjustment from a total and an interest percentage.
 *
 * @param percentAdjustment A percentage as a decimal.
 * @param startingTotal The current total that the `adjustment` will be added to.
 *
 * ```
 * dollarAdjustmentFromInterestPercentage(0.5, 100)
 * // 0.5
 * ```
 */
export function dollarAdjustmentFromInterestPercentage (percentAdjustment: number, startingTotal: number) {
  return (percentAdjustment * 0.01) * startingTotal
}

/*
 * Calculates the total interest earned over a specific amount of days.
 *
 * @param days Amount of days to calculate the total of interest for.
 * @param percentAdjustment A percentage as a decimal.
 * @param startingTotal The current total that the `adjustment` will be added to.
 *
 * ```
 * estimateInterestTotalOverTime(30, 0.5, 100))
 * // 116.1400082895346
 * ```
 */
export function estimateInterestTotalOverTime (days: number, percentAdjustment: number, startingTotal: number) {
  let total = startingTotal

  for (let i = 0; i < days; i++) {
    total += dollarAdjustmentFromInterestPercentage(percentAdjustment, total)
  }
  return total
}
