import { withdrawCow } from './withdrawCow.js'

describe('withdrawCow', () => {
  test('makes specified cow unavailable for trade', () => {
    const cowId = 'abc123'

    let { cowIdOfferedForTrade } = withdrawCow(
      { cowIdOfferedForTrade: cowId },
      'some-other-cow'
    )

    expect(cowIdOfferedForTrade).toEqual(cowId)

    cowIdOfferedForTrade = withdrawCow({ cowIdOfferedForTrade: cowId }, cowId)
      .cowIdOfferedForTrade

    expect(cowIdOfferedForTrade).toEqual('')
  })
})
