import { test, expect, Page } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

const goToFarmhandShuffle = async (page: Page) => {
  await page.locator('.view-select').click()
  await page.getByRole('option', { name: ': Farmhand Shuffle' }).click()
}

// See wager-and-play.test.ts for why this can't just be `.fill()`.
const typeWager = async (page: Page, digits: string) => {
  const wagerInput = page.getByLabel('Wager')
  await wagerInput.click()
  await wagerInput.press('Control+a')
  await wagerInput.pressSequentially(digits, { delay: 50 })
  return wagerInput
}

test('forfeiting an in-progress match counts it as a loss and returns to the wager screen', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await goToFarmhandShuffle(page)

  await typeWager(page, '5')
  await page.getByRole('button', { name: 'Start Match' }).click()

  await expect(page.getByTestId('match')).toBeVisible()
  await expect(page.locator('.money-display')).toHaveText('$450.00')

  await page.getByRole('button', { name: 'Forfeit Match' }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Forfeit match?')).toBeVisible()
  await expect(
    dialog.getByText(
      "Are you sure that you want to forfeit this match? You'll lose your $50.00 wager and it will count as a loss."
    )
  ).toBeVisible()

  await dialog.getByRole('button', { name: 'Do it' }).click()

  // The embedded game is gone and the wager form is back, not a stale board
  // left over from before farmhandShuffle.isMatchInProgress was cleared.
  await expect(page.getByTestId('match')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Start Match' })).toBeVisible()

  // No further deduction beyond the wager already spent - same as any
  // other loss - plus the "Shuffle Up and Deal" first-match achievement's
  // own $100 reward, which still fires on a forfeited match: $500
  // (fixture) - $50 (wager) + $100 (achievement) = $550.
  await expect(page.locator('.money-display')).toHaveText('$550.00')
  await expect(page.getByText('Shuffle Up and Deal')).toBeVisible()

  // The sidebar's own record reflects the loss.
  await expect(
    page.locator('.FarmhandShuffleContextMenu').getByText('Losses: 1')
  ).toBeVisible()
})

test('cancelling the forfeit confirmation leaves the match in progress', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await goToFarmhandShuffle(page)

  await typeWager(page, '5')
  await page.getByRole('button', { name: 'Start Match' }).click()

  await expect(page.getByTestId('match')).toBeVisible()
  await expect(page.locator('.money-display')).toHaveText('$450.00')

  await page.getByRole('button', { name: 'Forfeit Match' }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Forfeit match?')).toBeVisible()

  await dialog.getByRole('button', { name: 'Cancel' }).click()

  await expect(dialog).not.toBeVisible()
  await expect(page.getByTestId('match')).toBeVisible()
  await expect(page.locator('.money-display')).toHaveText('$450.00')
})
