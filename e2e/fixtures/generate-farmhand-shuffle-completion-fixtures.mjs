// Regenerates the two farmhand-shuffle-one-turn-from-*.json fixtures below.
// Run after a @jeremyckahn/farmhand-shuffle version bump that changes the
// serialized match shape (the same drift FarmhandShuffleView.tsx's own
// libraryVersion tagging guards against at runtime) - see FIXTURES.md in
// this directory for the full explanation.
//
//   node e2e/fixtures/generate-farmhand-shuffle-completion-fixtures.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

import {
  buildLowFundsMatch,
  MatchState,
  serializeMatch,
} from '@jeremyckahn/farmhand-shuffle/testing'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const farmhandShufflePackageJson = JSON.parse(
  readFileSync(
    path.join(
      __dirname,
      '..',
      '..',
      'node_modules',
      '@jeremyckahn',
      'farmhand-shuffle',
      'package.json'
    ),
    'utf8'
  )
)

// Matches BOT_PLAYER_ID in src/components/FarmhandShuffleView/FarmhandShuffleView.tsx.
const opponentPlayerId = 'farmhand-shuffle-bot'

// Reuses the existing unlocked fixture as a base - it's already at a level
// (35+) and money that satisfies the unlock gate, which is a separate
// concern from what these fixtures are for.
const baseFixture = JSON.parse(
  readFileSync(path.join(__dirname, 'farmhand-shuffle-unlocked.json'), 'utf8')
)

const wager = 50

/**
 * @param {string} losingPlayerId - 'sessionOwner' or 'opponent'
 */
const buildFixture = losingPlayerId => {
  const sessionOwnerPlayerId = randomUUID()

  const { match, botState } = buildLowFundsMatch({
    sessionOwnerPlayerId,
    opponentPlayerId,
    losingPlayerId:
      losingPlayerId === 'sessionOwner'
        ? sessionOwnerPlayerId
        : opponentPlayerId,
  })

  return {
    ...baseFixture,
    // Restored via PERSISTED_STATE_KEYS on import - must match the match's
    // own sessionOwnerPlayerId so RESUME's player lookups succeed (RESUME
    // overwrites match.sessionOwnerPlayerId with this value, but doesn't
    // touch match.table.players' keys).
    playerId: sessionOwnerPlayerId,
    farmhandShuffle: {
      isMatchInProgress: true,
      wager,
      serializedMatch: {
        libraryVersion: farmhandShufflePackageJson.version,
        matchState: MatchState.WAITING_FOR_PLAYER_TURN_ACTION,
        match: serializeMatch(match),
        botState,
        userPlayerId: sessionOwnerPlayerId,
        opponentPlayerId,
      },
      totalMatchesPlayed: 0,
      totalWins: 0,
      totalLosses: 0,
      currentWinStreak: 0,
      longestWinStreak: 0,
    },
  }
}

const fixtures = {
  'farmhand-shuffle-one-turn-from-win': buildFixture('opponent'),
  'farmhand-shuffle-one-turn-from-loss': buildFixture('sessionOwner'),
}

for (const [name, data] of Object.entries(fixtures)) {
  const outPath = path.join(__dirname, `${name}.json`)

  writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n')
  console.log(`Wrote ${outPath}`)
}
