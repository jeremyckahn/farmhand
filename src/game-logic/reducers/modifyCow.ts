import { findCowById } from '../../utils/findCowById.js'

/**
 * @param fn Function that takes a cow and returns the modified cow or undefined.
 */
export const modifyCow = (
  state: farmhand.state,
  cowId: string,
  fn: (cow: farmhand.cow) => Partial<farmhand.cow>
): farmhand.state => {
  const cow = findCowById(state.cowInventory, cowId)

  if (!cow) {
    return state
  }

  const cowInventory = [...state.cowInventory]
  const cowIndex = cowInventory.indexOf(cow)

  cowInventory[cowIndex] = {
    ...cow,
    ...fn(cow),
  }

  return {
    ...state,
    cowInventory,
  }
}
