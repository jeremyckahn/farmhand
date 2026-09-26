import { testState } from '../../test-utils/index.js'

import { placeFarmhandShuffleWager } from './placeFarmhandShuffleWager.js'

describe('placeFarmhandShuffleWager', () => {
  let state: farmhand.state

  beforeEach(() => {
    state = testState({
      money: 100,
      farmhandShuffle: {
        isMatchInProgress: false,
        wager: 0,
        serializedMatch: null,
        totalMatchesPlayed: 0,
        totalWins: 0,
        totalLosses: 0,
        currentWinStreak: 0,
        longestWinStreak: 0,
      },
    })
  })

  describe('wager is negative', () => {
    test('no-ops', () => {
      expect(placeFarmhandShuffleWager(state, -1)).toMatchObject({
        money: 100,
        farmhandShuffle: { isMatchInProgress: false, wager: 0 },
      })
    })
  })

  describe('wager exceeds current money', () => {
    test('no-ops', () => {
      expect(placeFarmhandShuffleWager(state, 101)).toMatchObject({
        money: 100,
        farmhandShuffle: { isMatchInProgress: false, wager: 0 },
      })
    })
  })

  describe('wager is 0', () => {
    test('proceeds, deducting nothing', () => {
      expect(placeFarmhandShuffleWager(state, 0)).toMatchObject({
        money: 100,
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 0,
          serializedMatch: null,
        },
      })
    })
  })

  describe('wager is valid and non-zero', () => {
    test('deducts the wager and marks a match in progress', () => {
      expect(placeFarmhandShuffleWager(state, 25)).toMatchObject({
        money: 75,
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 25,
          serializedMatch: null,
        },
      })
    })
  })

  describe('wager equals current money', () => {
    test('proceeds, deducting everything', () => {
      expect(placeFarmhandShuffleWager(state, 100)).toMatchObject({
        money: 0,
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 100,
        },
      })
    })
  })
})
