/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const addCowToInventory = (state, cow) => {
  const { cowInventory } = state

  return {
    ...state,
    cowInventory: [...cowInventory, cow],
  }
}
