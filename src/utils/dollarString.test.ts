import { dollarString } from './dollarString.js'

describe('dollarString', () => {
  test('formats number to dollar string', () => {
    expect(dollarString(1234.567)).toEqual('$1,235')
  })
})
