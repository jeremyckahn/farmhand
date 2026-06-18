import { toDecimal, dinero, USD } from 'dinero.js'

export const integerString = (number: number): string =>
  toDecimal(
    dinero({ amount: Math.round(number), currency: USD, scale: 0 }),
    ({ value }) => Number(value).toLocaleString('en-US')
  )
