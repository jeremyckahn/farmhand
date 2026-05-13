// TODO: Add tests for this reducer
export const addCowToInventory = (
  state: farmhand.state,
  cow: farmhand.cow
): farmhand.state => {
  const { cowInventory } = state

  return {
    ...state,
    cowInventory: [...cowInventory, cow],
  }
}
