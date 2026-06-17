import { offerCow } from './offerCow.js'
import { testState } from "../../test-utils/testState.js";

describe('offerCow', () => {
  test('makes specified cow available for trade', () => {
    const cowId = 'abc123'
    const { cowIdOfferedForTrade } = offerCow(testState(), cowId)

    expect(cowIdOfferedForTrade).toEqual(cowId)
  })
})
