/** @typedef {import("../index").farmhand.item} item */
/** @typedef {import("../index").farmhand.keg} keg */

import { itemsMap } from '../data/maps'

import { getInventoryQuantityMap } from './getInventoryQuantityMap'

import { getSaltRequirementsForFermentationRecipe } from './getSaltRequirementsForFermentationRecipe'

/**
 * @param {item} fermentationRecipe
 * @param {{ id: string, quantity: number }} inventory
 * @param {Array.<keg>} cellarInventory
 * @param {number} cellarSize
 * @returns {number}
 */
export const maxYieldOfFermentationRecipe = (
  fermentationRecipe,
  inventory,
  cellarInventory,
  cellarSize
) => {
  const {
    [fermentationRecipe.id]: itemQuantityInInventory = 0,
    [itemsMap.salt.id]: saltQuantityInInventory = 0,
  } = getInventoryQuantityMap(inventory)

  const maxYieldWithoutSalt = Math.min(
    cellarSize - cellarInventory.length,
    itemQuantityInInventory
  )

  const maxSaltYieldPotential = Math.floor(
    saltQuantityInInventory /
      getSaltRequirementsForFermentationRecipe(fermentationRecipe)
  )

  const maxYieldWithSalt = Math.min(maxYieldWithoutSalt, maxSaltYieldPotential)

  return maxYieldWithSalt
}
