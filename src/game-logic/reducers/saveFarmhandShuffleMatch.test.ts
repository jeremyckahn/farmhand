import { testState } from '../../test-utils/index.js'

import { saveFarmhandShuffleMatch } from './saveFarmhandShuffleMatch.js'

describe('saveFarmhandShuffleMatch', () => {
  let state: farmhand.state

  beforeEach(() => {
    state = testState({
      farmhandShuffle: {
        isMatchInProgress: true,
        wager: 25,
        serializedMatch: null,
        totalMatchesPlayed: 0,
        totalWins: 0,
        totalLosses: 0,
        currentWinStreak: 0,
        longestWinStreak: 0,
      },
    })
  })

  test('sets serializedMatch to the provided value', () => {
    const serializedMatch = ({
      libraryVersion: '0.0.1',
      matchState: 'WAITING_FOR_PLAYER_TURN_ACTION',
      match: {},
      botState: {},
      userPlayerId: 'user-player-id',
      opponentPlayerId: 'opponent-player-id',
    } as unknown) as farmhand.SerializedFarmhandShuffleMatch

    expect(saveFarmhandShuffleMatch(state, serializedMatch)).toMatchObject({
      farmhandShuffle: {
        isMatchInProgress: true,
        wager: 25,
        serializedMatch,
      },
    })
  })
})
