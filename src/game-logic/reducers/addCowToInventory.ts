// TODO: Add tests for this reducer
/**
 * @param state
 * @param cow
 * @returns {farmhand.state}
 */
export const addCowToInventory = (state, cow) => {
  const { cowInventory } = state

  return {
    ...state,
    cowInventory: [...cowInventory, cow],
  }
}
