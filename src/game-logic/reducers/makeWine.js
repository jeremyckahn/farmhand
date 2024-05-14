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
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine'

import { addKegToCellarInventory } from './addKegToCellarInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'

// FIXME: Test this
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

  const maxYield = cellarService.getMaxWineYield(
    grape,
    inventory,
    cellarInventory,
    cellarSize,
    wineVariety
  )

  if (maxYield < howMany) {
    return state
  }

  const wine = itemsMap[grape.wineId]

  for (let i = 0; i < howMany; i++) {
    const keg = cellarService.generateKeg(wine)

    state = addKegToCellarInventory(state, keg)
  }

  const saltRequirements = getYeastRequiredForWine(wineVariety)

  state = decrementItemFromInventory(state, grape.id, howMany)

  state = decrementItemFromInventory(
    state,
    itemsMap.yeast.id,
    howMany * saltRequirements
  )

  return state
}
