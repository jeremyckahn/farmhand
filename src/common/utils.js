import { itemsMap } from '../data/maps'

/**
 * @param {farmhand.priceEvent} [priceCrashes]
 * @param {farmhand.priceEvent} [priceSurges]
 * @returns {Object}
 */
export const generateValueAdjustments = (priceCrashes = {}, priceSurges = {}) =>
  Object.keys(itemsMap).reduce((acc, key) => {
    if (itemsMap[key].doesPriceFluctuate) {
      if (priceCrashes[key]) {
        acc[key] = 0.5
      } else if (priceSurges[key]) {
        acc[key] = 1.5
      } else {
        acc[key] = Math.random() + 0.5
      }
    }

    return acc
  }, {})

/**
 * @param {Array} an array of objects each containing a `weight` property
 * @returns {Object} one of the items from weightedOptions
 */
export function randomChoice(weightedOptions) {
  let totalWeight = 0
  let sortedOptions = []

  for (let option of weightedOptions) {
    totalWeight += option.weight
    sortedOptions.push(option)
  }

  sortedOptions.sort(o => o.weight)

  let diceRoll = Math.random() * totalWeight
  let option
  let runningTotal = 0

  for (let i in sortedOptions) {
    option = sortedOptions[i]

    if (diceRoll < option.weight + runningTotal) {
      return option
    }

    runningTotal += option.weight
  }
}
