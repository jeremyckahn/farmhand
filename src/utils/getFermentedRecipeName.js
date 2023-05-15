/** @typedef {import("../index").farmhand.item} item */

/**
 * @param {item} item
 */
export const getFermentedRecipeName = item => {
  return `Fermented ${item.name}`
}
