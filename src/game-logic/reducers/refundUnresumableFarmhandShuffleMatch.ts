import { moneyTotal } from '../../utils/moneyTotal.js'

import { showNotification } from './showNotification.js'

/**
 * Cleans up after a Farmhand Shuffle match that couldn't be resumed -
 * either `deserializeMatch` threw, or the persisted
 * `SerializedFarmhandShuffleMatch.libraryVersion` doesn't match the
 * installed `@jeremyckahn/farmhand-shuffle` version (schema drift, since
 * the library is pre-1.0/semver-unstable - see the plan's Edge cases and
 * 2.6). Unlike settleFarmhandShuffleMatch.ts, this is triggered from
 * `FarmhandShuffleView` itself (2.4) rather than from the library's
 * `onMatchEnd` callback, since the match never actually resumed far enough
 * to produce a winner: the wager is refunded, the match fields are
 * cleared, and no win/loss/streak counters change since the match never
 * really happened from the player's perspective.
 */
export const refundUnresumableFarmhandShuffleMatch = (
  state: farmhand.state
): farmhand.state => {
  const { farmhandShuffle, money } = state
  const { wager } = farmhandShuffle

  state = {
    ...state,
    money: moneyTotal(money, wager),
    farmhandShuffle: {
      ...farmhandShuffle,
      isMatchInProgress: false,
      serializedMatch: null,
      wager: 0,
    },
  }

  return showNotification(
    state,
    "Your Farmhand Shuffle match couldn't be resumed after an update - your wager was refunded.",
    'warning'
  )
}
