import { dinero, toDecimal, USD } from 'dinero.js'

/**

 * @returns Include dollar sign and other formatting, as well as cents.
 */

export const moneyString = number =>
  toDecimal(
    dinero({ amount: Math.round(number * 100), currency: USD }),
    ({ value }) =>
      Number(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
  )
