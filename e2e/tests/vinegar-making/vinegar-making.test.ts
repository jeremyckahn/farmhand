import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

test('should make vinegar, mature it and sell it', async ({ page }) => {
  await loadFixture(page, 'vinegar-making')

  // Go to Cellar
  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Cellar' }).click()

  // Verify initial cellar capacity
  await expect(page.getByText('Capacity: 0 / 10')).toBeVisible()

  // Switch to Vinegar Making tab
  await page.getByRole('tab', { name: 'Vinegar Making' }).click()

  // Find Apple Cider Vinegar recipe and make it
  const makeButton = page
    .locator('.VinegarRecipe')
    .filter({ hasText: 'Apple Cider Vinegar' })
    .getByRole('button', { name: 'Make' })
  await expect(makeButton).toBeVisible()
  await makeButton.click()

  // Switch to Cellar Inventory tab
  await page.getByRole('tab', { name: 'Cellar Inventory' }).click()

  // Verify that it is in the cellar
  await expect(page.getByText('Capacity: 1 / 10')).toBeVisible()

  // It should say "Days until ready: 14"
  await expect(page.getByText('Days until ready: 14')).toBeVisible()

  // Advance 14 days
  for (let i = 0; i < 13; i++) {
    await page.keyboard.press('Shift+C')
    await expect(page.getByText(`Days until ready: ${13 - i}`)).toBeVisible()
    await expect(page.locator('.farmhand-root')).not.toHaveClass(/block-input/)
  }
  await page.keyboard.press('Shift+C')
  await expect(page.locator('.farmhand-root')).not.toHaveClass(/block-input/)

  // Verify the "kegs ready to sell" notification appears on the day the
  // keg matures
  await expect(
    page.getByText('Kegs are ready to sell in the cellar:')
  ).toBeVisible()

  // Check it is mature
  await expect(page.getByText('Days since ready: 0')).toBeVisible()

  // Advance 1 more day to check value increase
  await page.keyboard.press('Shift+C')
  await expect(page.locator('.farmhand-root')).not.toHaveClass(/block-input/)
  await expect(page.getByText('Days since ready: 1')).toBeVisible()

  // Sell it
  const sellButton = page
    .locator('.Keg')
    .filter({ hasText: 'Apple Cider Vinegar' })
    .getByRole('button', { name: 'Sell' })
  await expect(sellButton).toBeVisible()
  await sellButton.click()

  // Verify empty cellar
  await expect(page.getByText('Capacity: 0 / 10')).toBeVisible()
})
