/** @typedef {farmhand.keg} keg */
/** @typedef {farmhand.state} state */

/**
 * ⚠️ It is the responsibility of the consumer of this reducer to ensure that
 * there is sufficient space in cellarInventory.



 */
export const addKegToCellarInventory = (state, keg) => {
  const { cellarInventory } = state

  return {
    ...state,
    cellarInventory: [...cellarInventory, keg],
  }
}
