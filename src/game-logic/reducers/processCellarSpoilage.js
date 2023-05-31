/** @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state */

import { randomNumberService } from '../../common/services/randomNumber'
import { getKeySpoilageRate } from '../../utils/getKegSpoilageRate'

import { removeKegFromCellar } from './removeKegFromCellar'

/**
 * @param {state} state
 * @returns state
 */
export const processCellarSpoilage = state => {
  const { cellarInventory } = state

  const newCellarInventory = [...cellarInventory]

  for (let i = newCellarInventory.length - 1; i > -1; i--) {
    const keg = newCellarInventory[i]
    const spoilageRate = getKeySpoilageRate(keg)

    if (randomNumberService.isRandomNumberLessThan(spoilageRate)) {
      state = removeKegFromCellar(state, keg)
    }
  }

  state = { ...state }

  return state
}
