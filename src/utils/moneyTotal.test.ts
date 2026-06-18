import { moneyTotal } from './moneyTotal.js'

describe('moneyTotal', () => {
  test('adds numbers', () => {
    expect(moneyTotal(0.1, 0.2)).toEqual(0.3)
  })

  test('subtracts numbers', () => {
    expect(moneyTotal(1000, -999.99)).toEqual(0.01)
  })
})
