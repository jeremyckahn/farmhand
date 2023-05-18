/** @typedef {import("../../index").farmhand.item} item */
/** @typedef {import("../../index").farmhand.keg} keg */
/** @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state */

import { v4 as uuid } from 'uuid'

import { PURCHASEABLE_CELLARS } from '../../constants'
import { itemsMap } from '../../data/maps'
import { getSaltRequirementsForFermentationRecipe } from '../../utils/getSaltRequirementsForFermentationRecipe'
import { maxYieldOfFermentationRecipe } from '../../utils/maxYieldOfFermentationRecipe'

import { addKegToCellarInventory } from './addKegToCellarInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'

// FIXME: Test this
/**
 * @param {state} state
 * @param {item} fermentationRecipe
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const makeFermentationRecipe = (
  state,
  fermentationRecipe,
  howMany = 1
) => {
  const { inventory, cellarInventory, purchasedCellar } = state

  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar)

  const maxYield = maxYieldOfFermentationRecipe(
    fermentationRecipe,
    inventory,
    cellarInventory,
    cellarSize
  )

  if (maxYield < howMany) {
    return state
  }

  for (let i = 0; i < howMany; i++) {
    /** @type keg */
    const keg = {
      id: uuid(),
      itemId: fermentationRecipe.id,
      daysUntilMature: fermentationRecipe.daysToFerment,
    }

    state = addKegToCellarInventory(state, keg)
  }

  const saltRequirements = getSaltRequirementsForFermentationRecipe(
    fermentationRecipe
  )

  state = decrementItemFromInventory(
    state,
    itemsMap.salt.id,
    howMany * saltRequirements
  )

  return state
}
