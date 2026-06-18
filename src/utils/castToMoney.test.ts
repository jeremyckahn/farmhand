import { castToMoney } from './castToMoney.js'

describe('castToMoney', () => {
  test('does not change valid money value', () => {
    expect(castToMoney(1.23)).toEqual(1.23)
  })

  test('rounds up', () => {
    expect(castToMoney(1.235)).toEqual(1.24)
  })

  test('rounds down', () => {
    expect(castToMoney(1.234)).toEqual(1.23)
  })
})
