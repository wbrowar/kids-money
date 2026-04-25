import { InterestThresholds } from '@types'
import { estimateInterestTotalOverTime } from '@/utils/adjustments.ts'
import { log } from '@/utils/console.ts'

/**
 * TODO
 *
 * @param goal
 * @param defaultInterest
 * @param interestThresholds
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
