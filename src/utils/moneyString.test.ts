import { moneyString } from './moneyString.js'

describe('moneyString.js', () => {
  test('formats number to dollar string', () => {
    expect(moneyString(1234.567)).toEqual('$1,234.57')
  })
})
