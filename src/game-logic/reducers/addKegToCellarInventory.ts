/**
 * ⚠️ It is the responsibility of the consumer of this reducer to ensure that
 * there is sufficient space in cellarInventory.
 */
export const addKegToCellarInventory = (
  state: farmhand.state,
  keg: farmhand.keg
): farmhand.state => {
  const { cellarInventory } = state

  return {
    ...state,
    cellarInventory: [...cellarInventory, keg],
  }
}
