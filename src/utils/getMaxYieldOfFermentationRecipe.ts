/** @typedef {farmhand.item} item */
/** @typedef {farmhand.keg} keg */

import { itemsMap } from '../data/maps.js'

import { getInventoryQuantityMap } from './getInventoryQuantityMap.js'

import { getSaltRequirementsForFermentationRecipe } from './getSaltRequirementsForFermentationRecipe.js'

/**

 * @param []} inventory



 */
export const getMaxYieldOfFermentationRecipe = (
  fermentationRecipe: item,
  inventory,
  cellarInventory: keg[],
  cellarSize: number
): number => {
  const {
    [fermentationRecipe.id]: itemQuantityInInventory = 0,
    [(itemsMap as Record<string, farmhand.item>).salt
      .id]: saltQuantityInInventory = 0,
  } = getInventoryQuantityMap(inventory)

  const maxSaltYieldPotential = Math.floor(
    saltQuantityInInventory /
      getSaltRequirementsForFermentationRecipe(fermentationRecipe)
  )

  const maxYield = Math.min(
    cellarSize - cellarInventory.length,
    itemQuantityInInventory,
    maxSaltYieldPotential
  )

  return maxYield
}
