import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

test('should purchase a cow pen and a cow', async ({ page }) => {
  // The crops-mature fixture has > $100k
  await loadFixture(page, 'crops-mature')

  // Go to Shop to buy Cow Pen
  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()

  // Switch to the Upgrades tab where the Cow Pen purchase button is located
  await page.getByRole('tab', { name: 'Upgrades' }).click()

  // Buy Cow Pen
  await page.locator('li').filter({ hasText: 'Buy cow pen' }).getByRole('button', { name: 'Buy' }).click()

  // Navigate to Cow Pen
  await page.getByText(': Shop').click()
  await page.getByRole('option', { name: ': Cows' }).click()

  // Buy the cow for sale
  // We expect a cow card "For sale" with a "Buy" button
  await page.getByRole('button', { name: 'Buy' }).first().click()

  // Assert that we can Hug and Sell the purchased cow in the context menu
  await expect(page.getByRole('button', { name: 'Hug' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sell' })).toBeVisible()
})
