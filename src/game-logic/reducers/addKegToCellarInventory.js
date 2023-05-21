/** @typedef {import("../../index").farmhand.keg} keg */
/** @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state */

/**
 * ⚠️ It is the responsibility of the consumer of this reducer to ensure that
 * there is sufficient space in cellarInventory.
 * @param {state} state
 * @param {keg} keg
 * @returns {state}
 */
export const addKegToCellarInventory = (state, keg) => {
  const { cellarInventory } = state

  return {
    ...state,
    cellarInventory: [...cellarInventory, keg],
  }
}
