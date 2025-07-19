import {
  GRAPES_REQUIRED_FOR_WINE,
  PURCHASEABLE_CELLARS,
} from '../../constants.js'
import { itemsMap } from '../../data/maps.js'
import { cellarService } from '../../services/cellar.js'
import { wineService } from '../../services/wine.js'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine.js'

import { addKegToCellarInventory } from './addKegToCellarInventory.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

/**
 * @param {farmhand.state} state
 * @param {farmhand.grape} grape
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const makeWine = (state, grape, howMany = 1) => {
  const { inventory, cellarInventory, purchasedCellar } = state

  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  const maxYield = wineService.getMaxWineYield({
    grape,
    inventory,
    cellarInventory,
    cellarSize,
  })

  const wine = itemsMap[grape.wineId]
  const wineYield = Math.min(howMany, maxYield)

  for (let i = 0; i < wineYield; i++) {
    const keg = cellarService.generateKeg(wine)

    state = addKegToCellarInventory(state, keg)
  }

  state = decrementItemFromInventory(
    state,
    grape.id,
    wineYield * GRAPES_REQUIRED_FOR_WINE
  )

  const yeastRequirements = getYeastRequiredForWine(grape.variety)

  state = decrementItemFromInventory(
    state,
    itemsMap.yeast.id,
    wineYield * yeastRequirements
  )

  return state
}
