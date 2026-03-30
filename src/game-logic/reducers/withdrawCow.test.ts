import { testState } from '../../test-utils/index.ts'

import { withdrawCow } from './withdrawCow.ts'

describe('withdrawCow', () => {
  test('makes specified cow unavailable for trade', () => {
    const cowId = 'abc123'

    let { cowIdOfferedForTrade } = withdrawCow(
      testState({ cowIdOfferedForTrade: cowId }),
      'some-other-cow'
    )

    expect(cowIdOfferedForTrade).toEqual(cowId)

    cowIdOfferedForTrade = withdrawCow(
      testState({ cowIdOfferedForTrade: cowId }),
      cowId
    ).cowIdOfferedForTrade

    expect(cowIdOfferedForTrade).toEqual('')
  })
})
