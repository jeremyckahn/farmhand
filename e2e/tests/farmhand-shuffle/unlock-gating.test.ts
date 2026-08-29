import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

test('the Farmhand Shuffle option is absent from the view-select dropdown when locked', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-locked')

  await page.locator('.view-select').click()

  await expect(
    page.getByRole('option', { name: ': Farmhand Shuffle' })
  ).not.toBeVisible()

  // Close the listbox rather than leaving it open for the next assertion.
  await page.keyboard.press('Escape')
})

test('the Farmhand Shuffle option is present in the view-select dropdown when unlocked', async ({
  page,
}) => {
  await loadFixture(page, 'farmhand-shuffle-unlocked')

  await page.locator('.view-select').click()

  await expect(
    page.getByRole('option', { name: ': Farmhand Shuffle' })
  ).toBeVisible()
})
