import { withdrawCow } from './withdrawCow.js'
import { testState } from "../../test-utils/testState.js";

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
