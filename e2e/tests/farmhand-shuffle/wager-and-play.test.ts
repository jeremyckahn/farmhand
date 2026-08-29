import { test, expect, Page } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

const goToFarmhandShuffle = async (page: Page) => {
  await page.locator('.view-select').click()
  await page.getByRole('option', { name: ': Farmhand Shuffle' }).click()
}

test('the wager form renders on the unlocked fixture', async ({ page }) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await goToFarmhandShuffle(page)

  await expect(page.getByText('Farmhand Shuffle')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start Match' })).toBeVisible()
})

test('entering a wager above current money disables the submit button', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await goToFarmhandShuffle(page)

  const wagerInput = page.getByLabel('Wager')
  await wagerInput.fill('999999999')

  await expect(page.getByRole('button', { name: 'Start Match' })).toBeDisabled()
})

test('placing a valid wager deducts it from the displayed money and mounts the embedded game', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await expect(page.locator('.money-display')).toHaveText('$500.00')

  await goToFarmhandShuffle(page)

  const wagerInput = page.getByLabel('Wager')
  await wagerInput.fill('50')
  await page.getByRole('button', { name: 'Start Match' }).click()

  await expect(page.locator('.money-display')).toHaveText('$450.00')
  await expect(page.getByTestId('match')).toBeVisible()
})
