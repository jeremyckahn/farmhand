// TODO: Add tests for this reducer
/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @param {Function(farmhand.cow)} fn Must return the modified cow or
 * undefined.
 * @returns {farmhand.state}
 */
export const modifyCow = (state, cowId, fn) => {
  const cowInventory = [...state.cowInventory]

  // TODO: Use the findCowById util here.
  const cow = cowInventory.find(({ id }) => id === cowId)

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
