import { testState } from '../../test-utils/index.js'

import { settleFarmhandShuffleMatch } from './settleFarmhandShuffleMatch.js'

const USER_PLAYER_ID = 'user-player-id'
const OPPONENT_PLAYER_ID = 'opponent-player-id'

describe('settleFarmhandShuffleMatch', () => {
  let state: farmhand.state

  beforeEach(() => {
    state = testState({
      money: 100,
      farmhandShuffle: {
        isMatchInProgress: true,
        wager: 25,
        serializedMatch: null,
        totalMatchesPlayed: 2,
        totalWins: 1,
        totalLosses: 1,
        currentWinStreak: 1,
        longestWinStreak: 2,
      },
    })
  })

  describe('the user wins', () => {
    test('pays out double the wager and updates win/streak counters', () => {
      expect(
        settleFarmhandShuffleMatch(state, USER_PLAYER_ID, USER_PLAYER_ID)
      ).toMatchObject({
        money: 150,
        farmhandShuffle: {
          isMatchInProgress: false,
          serializedMatch: null,
          wager: 0,
          totalMatchesPlayed: 3,
          totalWins: 2,
          totalLosses: 1,
          currentWinStreak: 2,
          longestWinStreak: 2,
        },
      })
    })

    test('advances longestWinStreak when the current streak surpasses it', () => {
      state.farmhandShuffle.currentWinStreak = 2
      state.farmhandShuffle.longestWinStreak = 2

      expect(
        settleFarmhandShuffleMatch(state, USER_PLAYER_ID, USER_PLAYER_ID)
      ).toMatchObject({
        farmhandShuffle: {
          currentWinStreak: 3,
          longestWinStreak: 3,
        },
      })
    })
  })

  describe('the user loses', () => {
    test('does not deduct further money and resets the win streak', () => {
      expect(
        settleFarmhandShuffleMatch(state, OPPONENT_PLAYER_ID, USER_PLAYER_ID)
      ).toMatchObject({
        money: 100,
        farmhandShuffle: {
          isMatchInProgress: false,
          serializedMatch: null,
          wager: 0,
          totalMatchesPlayed: 3,
          totalWins: 1,
          totalLosses: 2,
          currentWinStreak: 0,
          longestWinStreak: 2,
        },
      })
    })
  })

  describe('the match is a draw (winnerId is null)', () => {
    test('refunds the wager without touching win/loss/streak counters', () => {
      expect(
        settleFarmhandShuffleMatch(state, null, USER_PLAYER_ID)
      ).toMatchObject({
        money: 125,
        farmhandShuffle: {
          isMatchInProgress: false,
          serializedMatch: null,
          wager: 0,
          totalMatchesPlayed: 3,
          totalWins: 1,
          totalLosses: 1,
          currentWinStreak: 1,
          longestWinStreak: 2,
        },
      })
    })

    test('still counts as a played match even when it is a draw', () => {
      state.farmhandShuffle.totalMatchesPlayed = 0
      state.farmhandShuffle.totalWins = 0
      state.farmhandShuffle.totalLosses = 0

      expect(
        settleFarmhandShuffleMatch(state, null, USER_PLAYER_ID)
      ).toMatchObject({
        farmhandShuffle: {
          totalMatchesPlayed: 1,
        },
      })
    })
  })

  describe('$0 wager', () => {
    test('a win with a $0 wager pays out nothing but still counts', () => {
      state.farmhandShuffle.wager = 0

      expect(
        settleFarmhandShuffleMatch(state, USER_PLAYER_ID, USER_PLAYER_ID)
      ).toMatchObject({
        money: 100,
        farmhandShuffle: {
          wager: 0,
          totalWins: 2,
        },
      })
    })
  })
})
