import { integerString } from './integerString.js'

describe('integerString', () => {
  test('formats number to integer string string', () => {
    expect(integerString(1234.567)).toEqual('1,235')
  })
})
