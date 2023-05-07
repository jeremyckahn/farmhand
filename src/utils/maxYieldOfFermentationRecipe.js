/** @typedef {import("../index").farmhand.item} farmhand.item */
/** @typedef {import("../index").farmhand.keg} farmhand.keg */

import { getInventoryQuantityMap } from '.'

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
  /** @type {number} */
  const itemQuantityInInventory =
    getInventoryQuantityMap(inventory)[fermentationRecipe.id] ?? 0

  // FIXME: Test this
  return Math.min(
    cellarSize - cellarInventory.length,
    itemQuantityInInventory,
    inventory.length - inventoryLimit
  )
}
