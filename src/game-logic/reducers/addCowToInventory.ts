// TODO: Add tests for this reducer
/**
 * @param state
 * @param cow
 * @returns {farmhand.state}
 */
export const addCowToInventory = (state: farmhand.state, cow: farmhand.cow): farmhand.state => {
  const { cowInventory } = state

  return {
    ...state,
    cowInventory: [...cowInventory, cow],
  }
}
