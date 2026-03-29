import { PURCHASEABLE_CELLARS } from '../../constants.js'
import { itemsMap } from '../../data/maps.js'
import { getSaltRequirementsForFermentationRecipe } from '../../utils/getSaltRequirementsForFermentationRecipe.js'
import { getMaxYieldOfFermentationRecipe } from '../../utils/getMaxYieldOfFermentationRecipe.js'
import { cellarService } from '../../services/cellar.js'

import { addKegToCellarInventory } from './addKegToCellarInventory.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

/**
 * @param {farmhand.state} state
 * @param {farmhand.item} fermentationRecipe
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
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
