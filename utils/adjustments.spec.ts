import { describe, expect, test } from 'vitest'
import {
  addDollarAdjustmentToTotal,
  dollarAdjustmentFromInterestPercentage, estimateInterestTotalOverTime
} from './adjustments'

describe('Adjustments', () => {
  test('dollar adjustment adds dollar amount to total', () => {
    const results = addDollarAdjustmentToTotal(5, 100)
    expect(results).toBe(105)
  })

  test('percent adjustment obtained from interest percentage', () => {
    const results = dollarAdjustmentFromInterestPercentage(0.5, 100)
    expect(results).toBe(0.5)
  })

  test('percent adjustment is calculated correctly over dataset of days', () => {
    const dataset = [
      { days: 1, expect: 100.5 },
      { days: 7, expect: 103.55293969407344 },
      { days: 30, expect: 116.1400082895346 },
      { days: 365, expect: 617.4652783431255 }
    ]

    for (const row of dataset) {
      const results = estimateInterestTotalOverTime(row.days, 0.5, 100)
      expect(results).toBe(row.expect)
    }
  })
})
