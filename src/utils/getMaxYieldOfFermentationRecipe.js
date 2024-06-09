/** @typedef {import("../index").farmhand.item} item */
/** @typedef {import("../index").farmhand.keg} keg */

import { itemsMap } from '../data/maps'

import { getInventoryQuantityMap } from './getInventoryQuantityMap'

import { getSaltRequirementsForFermentationRecipe } from './getSaltRequirementsForFermentationRecipe'

/**
 * @param {item} fermentationRecipe
 * @param {{ id: string, quantity: number }[]} inventory
 * @param {Array.<keg>} cellarInventory
 * @param {number} cellarSize
 * @returns {number}
 */
export const getMaxYieldOfFermentationRecipe = (
  fermentationRecipe,
  inventory,
  cellarInventory,
  cellarSize
) => {
  const {
    [fermentationRecipe.id]: itemQuantityInInventory = 0,
    [itemsMap.salt.id]: saltQuantityInInventory = 0,
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
