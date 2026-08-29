import { testState } from '../../test-utils/index.js'

import { refundUnresumableFarmhandShuffleMatch } from './refundUnresumableFarmhandShuffleMatch.js'

describe('refundUnresumableFarmhandShuffleMatch', () => {
  let state: farmhand.state

  beforeEach(() => {
    state = testState({
      money: 100,
      farmhandShuffle: {
        isMatchInProgress: true,
        wager: 30,
        serializedMatch: ({
          libraryVersion: '0.0.1',
        } as unknown) as farmhand.SerializedFarmhandShuffleMatch,
        totalMatchesPlayed: 5,
        totalWins: 3,
        totalLosses: 2,
        currentWinStreak: 1,
        longestWinStreak: 2,
      },
    })
  })

  test('refunds the wager and clears the match fields without touching win/loss/streak counters', () => {
    expect(refundUnresumableFarmhandShuffleMatch(state)).toMatchObject({
      money: 130,
      farmhandShuffle: {
        isMatchInProgress: false,
        serializedMatch: null,
        wager: 0,
        totalMatchesPlayed: 5,
        totalWins: 3,
        totalLosses: 2,
        currentWinStreak: 1,
        longestWinStreak: 2,
      },
    })
  })

  test('surfaces a notification explaining the refund', () => {
    const result = refundUnresumableFarmhandShuffleMatch(state)

    expect(result.latestNotification?.message).toMatch(/couldn't be resumed/i)
  })
})
