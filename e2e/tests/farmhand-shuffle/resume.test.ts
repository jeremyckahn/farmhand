import { test, expect, Page } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

const goToFarmhandShuffle = async (page: Page) => {
  await page.locator('.view-select').click()
  await page.getByRole('option', { name: ': Farmhand Shuffle' }).click()
}

// The wager field always displays a real "0" digit (it's a fixedDecimalScale
// money input starting at $0.00, never empty) - `.fill()` doesn't work on
// it at all, and typing into it without clearing that "0" first inserts
// new digits *before* it rather than replacing it: typing just "5" lands
// on "$50.00", not "$5.00". Selecting all first makes the first keystroke
// replace the selection, which is native browser behavior that happens
// before any of react-number-format's own caret handling runs, so it's
// reliable regardless of that library's quirks.
const typeWager = async (page: Page, digits: string) => {
  const wagerInput = page.getByLabel('Wager')
  await wagerInput.click()
  await wagerInput.press('Control+a')
  // `.fill()` doesn't trigger react-number-format's controlled-input
  // handling at all - it sets the DOM value directly, bypassing it
  // entirely. Only real keystrokes, via pressSequentially, do.
  await wagerInput.pressSequentially(digits, { delay: 50 })
}

test('reloading mid-match resumes the same hand instead of dealing a fresh one, and does not re-deduct the wager', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await goToFarmhandShuffle(page)

  await typeWager(page, '5')
  await page.getByRole('button', { name: 'Start Match' }).click()

  await expect(page.getByTestId('match')).toBeVisible()
  await expect(page.locator('.money-display')).toHaveText('$495.00')

  const handCard = page.locator('[data-testid^="hand_"] img').first()
  await expect(handCard).toBeVisible()

  // The initial deal reaches an idle "waiting for the player" checkpoint
  // state as soon as it completes, so a checkpoint should already have been
  // written and persisted by the time the hand is visible - give it a
  // moment to flush to localforage before forcing a real reload.
  const originalCardName = await handCard.getAttribute('alt')

  await page.waitForTimeout(500)
  await page.reload()

  await expect(page.getByTestId('match')).toBeVisible()

  const resumedCardName = await page
    .locator('[data-testid^="hand_"] img')
    .first()
    .getAttribute('alt')

  expect(resumedCardName).toEqual(originalCardName)

  // The wager was already deducted once at placement time - resuming must
  // not deduct it again.
  await expect(page.locator('.money-display')).toHaveText('$495.00')
})
