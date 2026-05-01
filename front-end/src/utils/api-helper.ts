import { Kid } from '@types'

/**
 * Normalizes data before it is passed into the API to update a kid.
 *
 * @param {number} id The ID of the kid, as stored in the databse.
 * @param {Partial<Kid>} newProperties An object containing the settings that will get updated when updated via the API.
 * @return {object} The normalized kid data.
 */
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
