/** @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state */

import { randomNumberService } from '../../common/services/randomNumber'
import { itemsMap } from '../../data/maps'
import { wineService } from '../../services/wine'
import { KEG_SPOILED_MESSAGE } from '../../templates'
import { getKegSpoilageRate } from '../../utils/getKegSpoilageRate'

import { removeKegFromCellar } from './removeKegFromCellar'

/**
 * @param {state} state
 * @returns {state}
 */
export const processCellarSpoilage = state => {
  const { cellarInventory } = state

  const newCellarInventory = [...cellarInventory]

  for (let i = newCellarInventory.length - 1; i > -1; i--) {
    const keg = newCellarInventory[i]
    const kegItem = itemsMap[keg.itemId]
    const spoilageRate = getKegSpoilageRate(keg)

    if (
      !wineService.isWineRecipe(kegItem) &&
      randomNumberService.isRandomNumberLessThan(spoilageRate)
    ) {
      state = removeKegFromCellar(state, keg.id)
      state = {
        ...state,
        newDayNotifications: [
          ...state.newDayNotifications,
          {
            // @ts-expect-error
            message: KEG_SPOILED_MESSAGE`${keg}`,
            severity: 'error',
          },
        ],
      }
    }
  }

  state = { ...state }

  return state
}
