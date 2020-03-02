/**
 * @param {farmhand.crop} crop
 * @returns {string}
 */
export const CROW_ATTACKED = (_, crop) => `Oh no a crow ate your ${crop.name}!`;

/**
 * @param {number} cows
 * @returns {string}
 */
export const COW_PEN_PURCHASED = (_, cows) =>
  `Purchased a cow pen with capacity for ${cows} cows!`;

/**
 * @param {farmhand.cow} cow
 * @param {farmhand.item} milk
 * @returns {string}
 */
export const MILK_PRODUCED = (_, cow, milk) =>
  `${cow.name} produced a ${milk.name} for you!`;
