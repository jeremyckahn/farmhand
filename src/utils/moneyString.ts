import { dinero, toDecimal, USD } from 'dinero.js'

/**
 * @param {number} number
 * @returns {string} Include dollar sign and other formatting, as well as cents.
 */

export const moneyString = (number: number): string =>
  toDecimal(
    dinero({ amount: Math.round(number * 100), currency: USD }),
    ({ value }) =>
      Number(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
  )
