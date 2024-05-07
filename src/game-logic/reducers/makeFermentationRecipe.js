/**
 * @typedef {import("../../index").farmhand.item} item
 * @typedef {import("../../index").farmhand.keg} keg
 * @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state
 */

import { PURCHASEABLE_CELLARS } from '../../constants'
import { itemsMap } from '../../data/maps'
import { getSaltRequirementsForFermentationRecipe } from '../../utils/getSaltRequirementsForFermentationRecipe'
import { getMaxYieldOfFermentationRecipe } from '../../utils/getMaxYieldOfFermentationRecipe'
import { cellarService } from '../../services/cellar'

import { addKegToCellarInventory } from './addKegToCellarInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'

/**
 * @param {state} state
 * @param {item} fermentationRecipe
 * @param {number} [howMany=1]
 * @returns {state}
 */
export const makeFermentationRecipe = (
  state,
  fermentationRecipe,
  howMany = 1
) => {
  const { inventory, cellarInventory, purchasedCellar } = state

  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  const maxYield = getMaxYieldOfFermentationRecipe(
    fermentationRecipe,
    inventory,
    cellarInventory,
    cellarSize
  )

  if (maxYield < howMany) {
    return state
  }

  for (let i = 0; i < howMany; i++) {
    const keg = cellarService.generateKeg(fermentationRecipe)

    state = addKegToCellarInventory(state, keg)
  }

  const saltRequirements = getSaltRequirementsForFermentationRecipe(
    fermentationRecipe
  )

  state = decrementItemFromInventory(state, fermentationRecipe.id, howMany)

  state = decrementItemFromInventory(
    state,
    itemsMap.salt.id,
    howMany * saltRequirements
  )

  return state
}
