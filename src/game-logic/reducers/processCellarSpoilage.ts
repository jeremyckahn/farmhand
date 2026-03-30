/** @typedef {farmhand.state} state */

import { randomNumberService } from '../../common/services/randomNumber.ts'
import { itemsMap } from '../../data/maps.ts'
import { wineService } from '../../services/wine.ts'
import { KEG_SPOILED_MESSAGE } from '../../templates.ts'
import { getKegSpoilageRate } from '../../utils/getKegSpoilageRate.ts'

import { removeKegFromCellar } from './removeKegFromCellar.ts'

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
