/**
 * @typedef {import("../../index").farmhand.item} item
 * @typedef {import("../../index").farmhand.keg} keg
 * @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state
 */

import { PURCHASEABLE_CELLARS } from '../../constants'
import { itemsMap } from '../../data/maps'
// eslint-disable-next-line no-unused-vars
import { grapeVariety } from '../../enums'
import { cellarService } from '../../services/cellar'
import { wineService } from '../../services/wine'

import { addKegToCellarInventory } from './addKegToCellarInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'

// FIXME: Test this
/**
 * @param {state} state
 * @param {item} wine
 * @param {grapeVariety} wineVariety
 * @param {number} [howMany=1]
 * @returns {state}
 */
export const makeWine = (state, wine, wineVariety, howMany = 1) => {
  const { inventory, cellarInventory, purchasedCellar } = state

  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  const maxYield = cellarService.getMaxWineYield(
    wine,
    inventory,
    cellarInventory,
    cellarSize,
    wineVariety
  )

  if (maxYield < howMany) {
    return state
  }

  for (let i = 0; i < howMany; i++) {
    // FIXME: `wine` here is just the grape item. This needs to be resolved
    // into a wine to be added to the cellar inventory.
    const keg = cellarService.generateKeg(wine)

    state = addKegToCellarInventory(state, keg)
  }

  const saltRequirements = wineService.getYeastRequiredForWine(wineVariety)

  state = decrementItemFromInventory(state, wine.id, howMany)

  state = decrementItemFromInventory(
    state,
    itemsMap.yeast.id,
    howMany * saltRequirements
  )

  return state
}
