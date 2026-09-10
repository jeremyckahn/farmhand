import { test, expect, Page } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

// The fixtures loaded below are one real turn away from a Farmhand Shuffle
// match ending - see e2e/fixtures/generate-farmhand-shuffle-completion-fixtures.mjs
// and farmhand-shuffle's own src/game/config/MATCH_FIXTURES.md for the full
// mechanic and how to regenerate them. Scope here is deliberately just the
// integration surface (does ending a turn correctly settle the match, pay
// out, and unlock the achievement) - not the card game's own rules, which
// are farmhand-shuffle's own test suite's job.

const goToFarmhandShuffle = async (page: Page) => {
  await page.locator('.view-select').click()
  await page.getByRole('option', { name: ': Farmhand Shuffle' }).click()
}

test('winning a match pays out double the wager and unlocks the first-match achievement', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-one-turn-from-win')
  await goToFarmhandShuffle(page)

  await expect(page.getByTestId('match')).toBeVisible()

  await page.getByRole('button', { name: 'End turn' }).click()

  await expect(page.getByText('You won $100.00!')).toBeVisible()
  // $500 (fixture) + $100 (payout) + $100 (the achievement's own reward,
  // triggered by the same match settling - see 'farmhand-shuffle-first-match'
  // in src/data/achievements.ts) = $700.
  await expect(page.locator('.money-display')).toHaveText('$700.00')
  await expect(page.getByText('Shuffle Up and Deal')).toBeVisible()
})

test('losing a match does not pay out and still unlocks the first-match achievement', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-one-turn-from-loss')
  await goToFarmhandShuffle(page)

  await expect(page.getByTestId('match')).toBeVisible()

  await page.getByRole('button', { name: 'End turn' }).click()

  // Unlike the win fixture (whose payout is immediate), losing requires the
  // opponent's own full turn to resolve first - a chain of several
  // separately-delayed bot actions (crops, water, events, tools, harvest),
  // each one scheduled only once the previous one fires - before the tax
  // charge opening the session owner's next turn ends the match. Not
  // fastForward(): that jumps the clock and fires only what's already
  // scheduled at the moment it's called, which doesn't reliably cascade
  // through timers that get scheduled *during* the jump (i.e. every step
  // of this chain after the first). runFor() advances incrementally,
  // executing callbacks as they become due - including ones newly
  // scheduled along the way - which this chain depends on.
  await page.clock.runFor(15_000)

  await expect(page.getByText('You lost your $50.00 wager.')).toBeVisible()
  // $500 (fixture) + $100 (the first-match achievement's own reward,
  // which still fires on a loss - see 'farmhand-shuffle-first-match' in
  // src/data/achievements.ts) = $600. No further deduction: the wager was
  // already spent when it was placed.
  await expect(page.locator('.money-display')).toHaveText('$600.00')
  await expect(page.getByText('Shuffle Up and Deal')).toBeVisible()
})
