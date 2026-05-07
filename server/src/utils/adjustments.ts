import type { InterestThresholds } from '@types'

/**
 * Adds a dollar amount number to a total number.
 *
 * ```
 * addDollarAdjustmentToTotal(5, 100)
 * // 105
 * ```
 *
 * @param {number} adjustment The dollar amount.
 * @param {number} total The current total that the `adjustment` will be added to or subtracted from.
 * @return {number} The new total after the adjustment.
 */
export function addDollarAdjustmentToTotal(adjustment: number, total: number) {
  return adjustment + total
}

/**
 * Calculates the dollar adjustment from a total and an interest percentage.
 *
 * ```
 * dollarAdjustmentFromInterestPercentage(0.5, 100)
 * // 0.5
 * ```
 *
 * @param {number} percentAdjustment The percentage of interest that will be used in the calculation.
 * @param {number} startingTotal The current total that the calculation will be applied to.
 * @return {number} The dollar adjustment amount.
 */
export function dollarAdjustmentFromInterestPercentage(percentAdjustment: number, startingTotal: number) {
  return percentAdjustment * 0.01 * startingTotal
}

/**
 * Calculates the total interest earned over a specific number of days.
 *
 * ```
 * estimateInterestTotalOverTime(30, 0.5, 100))
 * // 116.1400082895346
 * ```
 *
 * @param {number} days Number of days to calculate the total of interest for.
 * @param {number} percentAdjustment A percentage as a decimal. Usually the kid’s default interest rate.
 * @param {number} startingTotal The current total that the `adjustment` will be added to.
 * @param {InterestThresholds} [interestThresholds=[]] The interest thresholds that determine how the interest rate changes.
 * @return {number} The estimated total after interest.
 */
export function estimateInterestTotalOverTime(
  days: number,
  percentAdjustment: number,
  startingTotal: number,
  interestThresholds: InterestThresholds = []
) {
  let total = startingTotal

  for (let i = 0; i < days; i++) {
    total += dollarAdjustmentFromInterestPercentage(
      interestFromInterestThresholds(total, percentAdjustment, interestThresholds),
      total
    )
  }
  return total
}

/**
 * Parses the interest thresholds and returns the interest for a given total.
 *
 * @param {number} total The total to calculate the interest for.
 * @param {number} defaultInterest The base interest to use before a threshold is reached.
 * @param {InterestThresholds} interestThresholds An array of arrays where each sub-array contains a threshold and an interest value.
 * @return {number} The interest rate for the given total.
 */
export function interestFromInterestThresholds(
  total: number,
  defaultInterest: number,
  interestThresholds: InterestThresholds
) {
  const interestTuple: number[] = [...interestThresholds, [0, defaultInterest]].find(
    ([threshold]) => total >= threshold
  ) ?? [0, defaultInterest]
  return interestTuple[1]
}
