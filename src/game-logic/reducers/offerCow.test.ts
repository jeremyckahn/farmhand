import { testState } from '../../test-utils/index.ts'

import { offerCow } from './offerCow.ts'

describe('offerCow', () => {
  test('makes specified cow available for trade', () => {
    const cowId = 'abc123'
    const { cowIdOfferedForTrade } = offerCow(testState(), cowId)

    expect(cowIdOfferedForTrade).toEqual(cowId)
  })
})
