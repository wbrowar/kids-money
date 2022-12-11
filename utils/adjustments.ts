export function addDollarAdjustmentToTotal (adjustment: number, total: number) {
  return adjustment + total
}

export function addPercentAdjustmentToTotal (adjustment: number, total: number) {
  return (adjustment * total) + total
}
