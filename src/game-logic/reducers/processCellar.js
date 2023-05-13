/** @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state */

// FIXME: Test this
/**
 * @param {state} state
 * @returns state
 */
export const processCellar = state => {
  const { cellarInventory } = state

  const newCellarInventory = [...cellarInventory]

  for (let i = 0; i < newCellarInventory.length; i++) {
    const keg = newCellarInventory[i]

    newCellarInventory[i] = {
      ...keg,
      daysUntilMature: keg.daysUntilMature - 1,
    }
  }

  state = { ...state, cellarInventory: newCellarInventory }

  return state
}
