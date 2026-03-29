// TODO: Add tests for this reducer
/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @param {Function} fn Function that takes a cow and returns the modified cow or undefined.
 * @returns {farmhand.state}
 */
export const modifyCow = (state, cowId, fn) => {
  const cowInventory = [...state.cowInventory]

  // TODO: Use the findCowById util here.
  const cow = cowInventory.find(({ id }) => id === cowId)

  if (!cow) {
    return state
  }

  const cowIndex = cowInventory.indexOf(cow)

  if (cowIndex === -1) {
    return state
  }

  cowInventory[cowIndex] = {
    ...cow,
    ...fn(cow),
  }

  return {
    ...state,
    cowInventory,
  }
}
