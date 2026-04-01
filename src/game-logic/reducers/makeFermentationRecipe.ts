import { PURCHASEABLE_CELLARS } from '../../constants.ts'
import { itemsMap } from '../../data/maps.ts'
import { getSaltRequirementsForFermentationRecipe } from '../../utils/getSaltRequirementsForFermentationRecipe.ts'
import { getMaxYieldOfFermentationRecipe } from '../../utils/getMaxYieldOfFermentationRecipe.ts'
import { cellarService } from '../../services/cellar.ts'

import { addKegToCellarInventory } from './addKegToCellarInventory.ts'
import { decrementItemFromInventory } from './decrementItemFromInventory.ts'

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
    // @ts-expect-error
    itemsMap.salt.id,
    howMany * saltRequirements
  )

  return state
}
