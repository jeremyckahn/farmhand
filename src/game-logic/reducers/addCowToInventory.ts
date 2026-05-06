// TODO: Add tests for this reducer

export const addCowToInventory = (state: any, cow: any): any => {
  const { cowInventory } = state

  return {
    ...state,
    cowInventory: [...cowInventory, cow],
  }
}
