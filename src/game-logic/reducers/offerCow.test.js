import { offerCow } from './offerCow.js'

describe('offerCow', () => {
  test('makes specified cow available for trade', () => {
    const cowId = 'abc123'
    const { cowIdOfferedForTrade } = offerCow({}, cowId)

    expect(cowIdOfferedForTrade).toEqual(cowId)
  })
})
