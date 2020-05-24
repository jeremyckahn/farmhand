/**
 * @param {farmhand.crop} crop
 * @returns {string}
 */
export const CROW_ATTACKED = (_, crop) => `Oh no a crow ate your ${crop.name}!`

/**
 * @param {number} cows
 * @returns {string}
 */
export const COW_PEN_PURCHASED = (_, cows) =>
  `Purchased a cow pen with capacity for ${cows} cows!`

/**
 * @param {farmhand.cow} cow
 * @param {farmhand.item} milk
 * @returns {string}
 */
export const MILK_PRODUCED = (_, cow, milk) =>
  `${cow.name} produced a ${milk.name} for you!`

/**
 * @param {farmhand.recipe} recipe
 * @returns {string}
 */
export const RECIPE_LEARNED = (_, recipe) =>
  `You learned how to make ${recipe.name}!`

/**
 * @param {farmhand.item} cropItem
 * @returns {string}
 */
export const PRICE_CRASH_NOTIFICATION = (_, { name }) =>
  `${name} prices have bottomed out! Avoid selling them until prices return to normal.`

/**
 * @param {farmhand.item} cropItem
 * @returns {string}
 */
export const PRICE_SURGE_NOTIFICATION = (_, { name }) =>
  `${name} prices are at their peak! Now is the time to sell!`
