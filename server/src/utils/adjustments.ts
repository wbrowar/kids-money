import type { InterestThresholds } from '@types'

/**
 * Adds a dollar amount number to a total number.
 *
 * ```
 * addDollarAdjustmentToTotal(5, 100)
 * // 105
 * ```
 *
 * @param adjustment The dollar amount.
 * @param total The current total that the `adjustment` will be added to or subtracted from.
 */
export function addDollarAdjustmentToTotal(adjustment: number, total: number) {
  return adjustment + total
}

/**
 * Calculates the dollar adjustment from a total and an interest percentage.
 *
 * @param percentAdjustment A percentage as a decimal.
 * @param startingTotal The current total that the `adjustment` will be added to.
 *
 * ```
 * dollarAdjustmentFromInterestPercentage(0.5, 100)
 * // 0.5
 * ```
 *
 * @param percentAdjustment The percentage of interest that will be used in the calculation.
 * @param startingTotal The current total that the calculation will be applied to.
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
 * @param days Number of days to calculate the total of interest for.
 * @param percentAdjustment A percentage as a decimal.
 * @param startingTotal The current total that the `adjustment` will be added to.
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
 * @param total The total to calculate the interest for.
 * @param defaultInterest The base interest to use before a threshold is reached.
 * @param interestThresholds An array of arrays where each sub-array contains a threshold and an interest value.
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
