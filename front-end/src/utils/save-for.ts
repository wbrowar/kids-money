import { InterestThresholds } from '@types'
import { estimateInterestTotalOverTime } from '@server/utils/adjustments.ts'
import { log } from '@/utils/console.ts'

/**
 * Estimates the number of days required to reach a financial goal based on the provided current total,
 * default interest rate, and interest thresholds. The calculation stops at the maximum number of days if the goal is not reached earlier.
 *
 * @param {number} goal - The target financial goal to be reached.
 * @param {number} currentTotal - The current total amount saved or invested.
 * @param {number} defaultInterest - The default annual interest rate applied to the savings.
 * @param {InterestThresholds} interestThresholds - The interest thresholds that determine how the interest rate changes over time based on specific conditions.
 * @param {number} [maxDays=500] - The maximum number of days allowed for the estimation, defaulting to 500 days if not provided.
 * @return {number} The estimated number of days required to achieve the financial goal or the maximum number of days if the goal is not met within that period.
 */
export function savingForGoalEstimate(
  goal: number,
  currentTotal: number,
  defaultInterest: number,
  interestThresholds: InterestThresholds,
  maxDays = 500
) {
  let day = maxDays

  log('Calculating days to reach goal', goal, currentTotal, defaultInterest, interestThresholds)

  for (let i = 0; i < maxDays; i++) {
    if (estimateInterestTotalOverTime(i + 1, defaultInterest, currentTotal, interestThresholds) > goal) {
      day = i + 1
      break
    }
  }

  return day
}
