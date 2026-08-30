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
  // any keystroke that would push it over that - unlike `.fill()`, which
  // sets the DOM value directly and bypasses react-number-format's
  // input handling entirely (it doesn't respond to that at all; only
  // real keystrokes, via pressSequentially, exercise its
  // controlled-input logic).
  //
  // Not asserting an exact clamped value (e.g. "$99.00"): react-number-format
  // v4's caret handling has its own timing assumptions that don't
  // perfectly line up with rapid automated keystrokes even with a delay
  // between them, so the precise digits that land can vary. The
  // invariant that actually matters - and that isAllowed exists to
  // guarantee - is that the parsed value never exceeds the player's
  // money, which is what keeps the submit button enabled.
  const wagerInput = page.getByLabel('Wager')
  await wagerInput.pressSequentially('999999999', { delay: 50 })

  const value = await wagerInput.inputValue()
  const parsed = Number(value.replace(/[^0-9.]/g, ''))
  expect(parsed).toBeGreaterThan(0)
  expect(parsed).toBeLessThanOrEqual(500)
  await expect(page.getByRole('button', { name: 'Start Match' })).toBeEnabled()
})

test('placing a valid wager deducts it from the displayed money and mounts the embedded game', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await expect(page.locator('.money-display')).toHaveText('$500.00')

  await goToFarmhandShuffle(page)

  // `.fill()` doesn't work here - see the comment on the field-clamping
  // test above. A single keystroke (rather than a multi-digit amount)
  // sidesteps react-number-format v4's caret-continuity timing issues
  // across successive keystrokes - see that same comment.
  const wagerInput = page.getByLabel('Wager')
  await wagerInput.pressSequentially('5', { delay: 50 })
  await page.getByRole('button', { name: 'Start Match' }).click()

  await expect(page.locator('.money-display')).toHaveText('$495.00')
  await expect(page.getByTestId('match')).toBeVisible()
})
