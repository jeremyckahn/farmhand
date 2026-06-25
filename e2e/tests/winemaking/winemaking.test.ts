import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

test('should make wine, mature it and sell it', async ({ page }) => {
  await loadFixture(page, 'winemaking')

  // Go to Cellar
  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Cellar' }).click()

  // Verify initial cellar capacity
  await expect(page.getByText('Capacity: 0 / 10')).toBeVisible()

  // Switch to Winemaking tab
  await page.getByRole('tab', { name: 'Winemaking' }).click()

  // Find Chardonnay wine recipe and make it
  const makeButton = page
    .locator('.WineRecipe')
    .filter({ hasText: 'Chardonnay' })
    .getByRole('button', { name: 'Make' })
  await expect(makeButton).toBeVisible()
  await makeButton.click()

  // Switch to Cellar Inventory tab
  await page.getByRole('tab', { name: 'Cellar Inventory' }).click()

  // Verify that it is in the cellar
  await expect(page.getByText('Capacity: 1 / 10')).toBeVisible()

  // It should say "Days until ready: 5"
  await expect(page.getByText('Days until ready: 5')).toBeVisible()

  // Advance 5 days
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Shift+C')
    await expect(page.getByText(`Days until ready: ${4 - i}`)).toBeVisible()
  }
  await page.keyboard.press('Shift+C')

  // Check it is mature
  await expect(page.getByText('Days since ready: 0')).toBeVisible()

  // Advance 1 more day to check value increase
  await page.keyboard.press('Shift+C')
  await expect(page.getByText('Days since ready: 1')).toBeVisible()

  // Sell it
  const sellButton = page
    .locator('.Keg')
    .filter({ hasText: 'Chardonnay Wine' })
    .getByRole('button', { name: 'Sell' })
  await expect(sellButton).toBeVisible()
  await sellButton.click()

  // Verify empty cellar
  await expect(page.getByText('Capacity: 0 / 10')).toBeVisible()
})
