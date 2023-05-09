/** @typedef {import("../index").farmhand.item} farmhand.item */
/** @typedef {import("../index").farmhand.keg} farmhand.keg */

import { getSaltRequirementsForFermentationRecipe } from './getSaltRequirementsForFermentationRecipe'

import { getInventoryQuantityMap } from '.'

// FIXME: Test this
/**
 * @param {farmhand.item} fermentationRecipe
 * @param {Array.<farmhand.item>} inventory
 * @param {Array.<farmhand.keg>} cellarInventory
 * @param {number} cellarSize
 * @param {number} inventoryLimit
 * @returns {number}
 */
export const maxYieldOfFermentationRecipe = (
  fermentationRecipe,
  inventory,
  cellarInventory,
  cellarSize,
  inventoryLimit
) => {
  const {
    [fermentationRecipe.id]: itemQuantityInInventory = 0,
    saltQuantityInInventory = 0,
  } = getInventoryQuantityMap(inventory)

  const maxYieldWithoutSalt = Math.min(
    cellarSize - cellarInventory.length,
    itemQuantityInInventory,
    inventory.length - inventoryLimit
  )

  const maxSaltYieldPotential = Math.floor(
    saltQuantityInInventory /
      getSaltRequirementsForFermentationRecipe(fermentationRecipe)
  )

  const maxYieldWithSalt = Math.min(maxYieldWithoutSalt, maxSaltYieldPotential)

  return maxYieldWithSalt
}
