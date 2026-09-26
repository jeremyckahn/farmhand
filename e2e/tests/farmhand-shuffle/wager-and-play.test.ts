import { test, expect, Page } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

const goToFarmhandShuffle = async (page: Page) => {
  await page.locator('.view-select').click()
  await page.getByRole('option', { name: ': Farmhand Shuffle' }).click()
}

// The wager field always displays a real "0" digit (it's a fixedDecimalScale
// money input starting at $0.00, never empty) - `.fill()` doesn't work on
// it at all (see below), and typing into it without clearing that "0"
// first inserts new digits *before* it rather than replacing it: typing
// just "5" lands on "$50.00", not "$5.00". Selecting all first makes the
// first keystroke replace the selection, which is native browser
// behavior that happens before any of react-number-format's own caret
// handling runs, so it's reliable regardless of that library's quirks.
const typeWager = async (page: Page, digits: string) => {
  const wagerInput = page.getByLabel('Wager')
  await wagerInput.click()
  await wagerInput.press('Control+a')
  // `.fill()` doesn't trigger react-number-format's controlled-input
  // handling at all - it sets the DOM value directly, bypassing it
  // entirely. Only real keystrokes, via pressSequentially, do.
  await wagerInput.pressSequentially(digits, { delay: 50 })
  return wagerInput
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
  // any keystroke that would push it over that.
  //
  // Not asserting an exact clamped value (e.g. "$99.00"): react-number-format
  // v4's caret handling has its own timing assumptions that don't
  // perfectly line up with rapid automated keystrokes even with a delay
  // between them, so the precise digits that land can vary. The
  // invariant that actually matters - and that isAllowed exists to
  // guarantee - is that the parsed value never exceeds the player's
  // money, which is what keeps the submit button enabled.
  const wagerInput = await typeWager(page, '999999999')

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

  await typeWager(page, '5')
  await page.getByRole('button', { name: 'Start Match' }).click()

  await expect(page.locator('.money-display')).toHaveText('$495.00')
  await expect(page.getByTestId('match')).toBeVisible()
})
