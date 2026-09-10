import { moneyTotal } from '../../utils/moneyTotal.js'

/**
 * Places a wager for a new Farmhand Shuffle match (see levels.ts:35 for the
 * unlock). The wager is deducted from the player's money immediately, up
 * front, so that a player who walks away mid-match doesn't lose (or need to
 * re-pay) their stake - see the "Resume" design decision in the Farmhand
 * Shuffle integration plan.
 *
 * A wager of 0 is valid and proceeds normally (a free match still plays out
 * and can still be won/lost/drawn - see settleFarmhandShuffleMatch.ts).
 */
export const placeFarmhandShuffleWager = (
  state: farmhand.state,
  wager: number
): farmhand.state => {
  const { farmhandShuffle, money } = state

  if (wager < 0 || wager > money) {
    return state
  }

  return {
    ...state,
    money: moneyTotal(money, -wager),
    farmhandShuffle: {
      ...farmhandShuffle,
      wager,
      isMatchInProgress: true,
      serializedMatch: null,
    },
  }
}
