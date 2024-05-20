/**
 * @typedef {import("../../index").farmhand.item} item
 * @typedef {import("../../index").farmhand.keg} keg
 * @typedef {import("../../index").farmhand.grape} grape
 * @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state
 */

import { PURCHASEABLE_CELLARS } from '../../constants'
import { itemsMap } from '../../data/maps'
// eslint-disable-next-line no-unused-vars
import { grapeVariety } from '../../enums'
import { cellarService } from '../../services/cellar'
import { wineService } from '../../services/wine'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine'

import { addKegToCellarInventory } from './addKegToCellarInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'

/**
 * @param {state} state
 * @param {grape} grape
 * @param {grapeVariety} wineVariety
 * @param {number} [howMany=1]
 * @returns {state}
 */
export const makeWine = (state, grape, wineVariety, howMany = 1) => {
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

  const saltRequirements = getYeastRequiredForWine(wineVariety)

  state = decrementItemFromInventory(state, grape.id, wineYield)

  state = decrementItemFromInventory(
    state,
    itemsMap.yeast.id,
    howMany * saltRequirements
  )

  return state
}
