/** @typedef {farmhand.state} state */

import { processCellarSpoilage } from './processCellarSpoilage.js'

/**
 * @param {state} state
 * @returns state
 */
export const processCellar = state => {
  state = processCellarSpoilage(state)
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
