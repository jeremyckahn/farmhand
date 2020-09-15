import { moneyString } from './utils'

import { itemUnlockLevels, levels } from './data/levels'
import { itemsMap } from './data/maps'

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
 * @param {Object.<string, number>} milksProduced
 * @returns {string}
 */
export const MILKS_PRODUCED = (_, milksProduced) => {
  let message = `Your cows produced milks:
`

  Object.keys(milksProduced)
    .sort()
    .forEach(
      milkName =>
        (message += `  - ${milksProduced[milkName]} ${milkName}${
          milksProduced[milkName] > 1 ? 's' : ''
        }
`)
    )

  return message
}

/**
 * @param {farmhand.cow} cow
 * @returns {string}
 */
export const COW_ATTRITION_MESSAGE = (_, { name }) =>
  `${name} got hungry from being underfed and ran away!`

/**
 * @param {farmhand.cow} parentCow1
 * @param {farmhand.cow} parentCow2
 * @param {farmhand.cow} offspringCow
 * @returns {string}
 */
export const COW_BORN_MESSAGE = (_, parentCow1, parentCow2, offspringCow) =>
  `${parentCow1.name} and ${parentCow2.name} had a baby: ${offspringCow.name}! Welcome to the world, ${offspringCow.name}!`

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

/**
 * @param {number} newLevel
 * @returns {string}
 */
export const LEVEL_GAINED_NOTIFICATION = (_, newLevel) => {
  let chunks = [`You reached **level ${newLevel}!**`]

  if (itemUnlockLevels[newLevel]) {
    chunks.push(
      `You can now buy **${
        itemsMap[itemUnlockLevels[newLevel]].name
      }** in the shop.`
    )
  }

  const levelObject = levels[newLevel]
  if (levelObject && levelObject.increasesSprinklerRange) {
    chunks.push(`Sprinkler range has increased.`)
  }

  chunks.push('Way to go!')

  return chunks.join(' ')
}
