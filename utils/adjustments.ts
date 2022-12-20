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
