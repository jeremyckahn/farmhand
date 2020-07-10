import { moneyString } from './utils'

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
  `Purchased a cow pen with capacity for ${cows} cows! You can visit your cow pen by going to the "Cows" page.`

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
export const PRICE_CRASH = (_, { name }) =>
  `${name} prices have bottomed out! Avoid selling them until prices return to normal.`

/**
 * @param {farmhand.item} cropItem
 * @returns {string}
 */
export const PRICE_SURGE = (_, { name }) =>
  `${name} prices are at their peak! Now is the time to sell!`

/**
 * @param {farmhand.achievement} achievement
 * @returns {string}
 */
export const ACHIEVEMENT_COMPLETED = (_, { name, rewardDescription }) =>
  `You achieved "${name}!" Way to go!

You earned: ${rewardDescription}`

/**
 * @returns {string}
 */
export const LOAN_PAYOFF = () =>
  `You paid off your loan to the bank! You're finally free!`

/**
 * @param {number} loanBalance
 * @returns {string}
 */
export const LOAN_INCREASED = (_, loanBalance) =>
  `You took out a new loan. Your current balance is ${moneyString(
    loanBalance
  )}.`

/**
 * @param {number} loanBalance
 * @returns {string}
 */
export const LOAN_BALANCE_NOTIFICATION = (_, loanBalance) =>
  `Your loan balance has grown to ${moneyString(loanBalance)}.`
