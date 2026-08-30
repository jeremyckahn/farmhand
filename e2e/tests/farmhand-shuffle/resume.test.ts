import { test, expect, Page } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

const goToFarmhandShuffle = async (page: Page) => {
  await page.locator('.view-select').click()
  await page.getByRole('option', { name: ': Farmhand Shuffle' }).click()
}

test('reloading mid-match resumes the same hand instead of dealing a fresh one, and does not re-deduct the wager', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await goToFarmhandShuffle(page)

  // `.fill()` doesn't trigger react-number-format's controlled-input
  // handling at all (it sets the DOM value directly, bypassing it
  // entirely) - only real keystrokes, via pressSequentially, do. The
  // delay between keystrokes matters too: firing them faster than React
  // can reconcile the controlled input's re-formatted value races with
  // react-number-format's own internal state and garbles the result.
  const wagerInput = page.getByLabel('Wager')
  await wagerInput.pressSequentially('50', { delay: 50 })
  await page.getByRole('button', { name: 'Start Match' }).click()

  await expect(page.getByTestId('match')).toBeVisible()
  await expect(page.locator('.money-display')).toHaveText('$450.00')

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
  await expect(page.locator('.money-display')).toHaveText('$450.00')
})
