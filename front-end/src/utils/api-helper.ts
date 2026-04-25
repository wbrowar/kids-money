import { Kid } from '@types'

export function prepareKidForSave(id: number, newProperties: Partial<Kid>) {
  // Convert number properties to number type
  if (newProperties.interest && typeof newProperties.interest !== 'number') {
    newProperties.interest = parseFloat(newProperties.interest)
  }
  if (newProperties.savingForValue && typeof newProperties.savingForValue !== 'number') {
    newProperties.savingForValue = parseFloat(newProperties.savingForValue)
  }

  return { id, ...newProperties }
}
