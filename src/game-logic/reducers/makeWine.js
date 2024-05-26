/**
 * @typedef {import("../../index").farmhand.item} item
 * @typedef {import("../../index").farmhand.keg} keg
 * @typedef {import("../../index").farmhand.grape} grape
 * @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state
 */

import { GRAPES_REQUIRED_FOR_WINE, PURCHASEABLE_CELLARS } from '../../constants'
import { itemsMap } from '../../data/maps'
import { cellarService } from '../../services/cellar'
import { wineService } from '../../services/wine'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine'

import { addKegToCellarInventory } from './addKegToCellarInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'

/**
 * @param {state} state
 * @param {grape} grape
 * @param {number} [howMany=1]
 * @returns {state}
 */
export const makeWine = (state, grape, howMany = 1) => {
  const { inventory, cellarInventory, purchasedCellar } = state

  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  const maxYield = wineService.getMaxWineYield(
    grape,
    inventory,
    cellarInventory,
    cellarSize
  )

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
