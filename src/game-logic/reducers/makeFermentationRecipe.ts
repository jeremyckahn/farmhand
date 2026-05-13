import { PURCHASEABLE_CELLARS } from '../../constants.js'
import { itemsMap } from '../../data/maps.js'
import { getSaltRequirementsForFermentationRecipe } from '../../utils/getSaltRequirementsForFermentationRecipe.js'
import { getMaxYieldOfFermentationRecipe } from '../../utils/getMaxYieldOfFermentationRecipe.js'
import { cellarService } from '../../services/cellar.js'

import { addKegToCellarInventory } from './addKegToCellarInventory.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

export const makeFermentationRecipe = (
  state: farmhand.state,
  fermentationRecipe: farmhand.item,
  howMany: number = 1
): farmhand.state => {
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
    (itemsMap as Record<string, farmhand.item>).salt.id,
    howMany * saltRequirements
  )

  return state
}
