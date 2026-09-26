import { moneyTotal } from '../../utils/moneyTotal.js'

/**
 * Settles a completed Farmhand Shuffle match (called from the
 * `onMatchEnd` callback wired up to `@jeremyckahn/farmhand-shuffle`'s
 * `Match` component - see the plan's 2.4). `winnerId` is `null` when the
 * library reports a draw (`IMatch.winner === null` at game-over), which is
 * treated as a push: the wager is refunded and no streak/win/loss counters
 * change.
 *
 * `totalMatchesPlayed` is incremented in every branch - win, loss, and draw
 * alike - so the "first match" achievement (see achievements.ts) can key
 * off it directly instead of `totalWins + totalLosses`, which would never
 * become true if a player's first-ever match happens to be a draw.
 */
export const settleFarmhandShuffleMatch = (
  state: farmhand.state,
  winnerId: string | null,
  userPlayerId: string
): farmhand.state => {
  const { farmhandShuffle, money } = state
  const { wager } = farmhandShuffle

  const isDraw = winnerId === null
  const isWin = !isDraw && winnerId === userPlayerId

  let newMoney = money
  let totalWins = farmhandShuffle.totalWins
  let totalLosses = farmhandShuffle.totalLosses
  let currentWinStreak = farmhandShuffle.currentWinStreak
  let longestWinStreak = farmhandShuffle.longestWinStreak

  if (isDraw) {
    // Push: refund the wager, no streak/win/loss change.
    newMoney = moneyTotal(money, wager)
  } else if (isWin) {
    // The wager was already deducted at placement time
    // (placeFarmhandShuffleWager.ts), so a win pays out double the wager.
    newMoney = moneyTotal(money, wager * 2)
    totalWins += 1
    currentWinStreak += 1
    longestWinStreak = Math.max(longestWinStreak, currentWinStreak)
  } else {
    // Loss: no further deduction, the wager was already spent.
    totalLosses += 1
    currentWinStreak = 0
  }

  return {
    ...state,
    money: newMoney,
    farmhandShuffle: {
      ...farmhandShuffle,
      isMatchInProgress: false,
      serializedMatch: null,
      wager: 0,
      totalMatchesPlayed: farmhandShuffle.totalMatchesPlayed + 1,
      totalWins,
      totalLosses,
      currentWinStreak,
      longestWinStreak,
    },
  }
}
