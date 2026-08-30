import { test, expect, Page } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

const goToFarmhandShuffle = async (page: Page) => {
  await page.locator('.view-select').click()
  await page.getByRole('option', { name: ': Farmhand Shuffle' }).click()
}

test('the wager form renders on the unlocked fixture', async ({ page }) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await goToFarmhandShuffle(page)

  // Not `getByText('Farmhand Shuffle')`: that text also appears in the nav
  // header, view title, and select combobox/option, so it's ambiguous in
  // strict mode. The wager card's subheader text is unique.
  await expect(
    page.getByText('Wager money on a match against a bot opponent.')
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start Match' })).toBeVisible()
})

test('the wager field refuses to accept more than the player currently has', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await goToFarmhandShuffle(page)

  // The fixture's money is $500. The field's isAllowed callback rejects
  // any keystroke that would push it over that, so real typing can never
  // actually land on an over-max value - unlike `.fill()`, which sets the
  // DOM value directly and bypasses react-number-format's input handling
  // entirely (it doesn't respond to that at all; only real keystrokes,
  // via pressSequentially, exercise its controlled-input logic). Typing
  // "999999999" digit by digit is rejected as soon as the running value
  // would exceed $500 (at the third "9"), leaving "99" as the last
  // accepted value.
  const wagerInput = page.getByLabel('Wager')
  await wagerInput.pressSequentially('999999999')

  await expect(wagerInput).toHaveValue('$99.00')
  await expect(page.getByRole('button', { name: 'Start Match' })).toBeEnabled()
})

test('placing a valid wager deducts it from the displayed money and mounts the embedded game', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await expect(page.locator('.money-display')).toHaveText('$500.00')

  await goToFarmhandShuffle(page)

  // `.fill()` doesn't work here - see the comment on the field-clamping
  // test above.
  const wagerInput = page.getByLabel('Wager')
  await wagerInput.pressSequentially('50')
  await page.getByRole('button', { name: 'Start Match' }).click()

  await expect(page.locator('.money-display')).toHaveText('$450.00')
  await expect(page.getByTestId('match')).toBeVisible()
})
