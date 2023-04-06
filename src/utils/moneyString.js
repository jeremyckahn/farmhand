import Dinero from 'dinero.js'

/**
 * @param {number} number
 * @returns {string} Include dollar sign and other formatting, as well as cents.
 */

export const moneyString = number =>
  Dinero({ amount: Math.round(number * 100) }).toFormat()
