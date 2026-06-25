import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

test('should limit wine making to cellar capacity', async ({ page }) => {
  await loadFixture(page, 'winemaking-constrained')

  // Go to Cellar
  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Cellar' }).click()

  // Switch to Winemaking tab
  await page.getByRole('tab', { name: 'Winemaking' }).click()

  // Find Chardonnay wine recipe. Verify max quantity in the number input is 10.
  const wineRecipe = page.locator('.WineRecipe').filter({ hasText: 'Chardonnay' })
  await expect(wineRecipe).toBeVisible()

  // The quantity input default to 1. Try filling an amount larger than capacity (11).
  const quantityInput = wineRecipe.locator('input[type="text"]')
  await quantityInput.fill('11')

  // The value should be constrained to max cellar space which is 10
  await expect(quantityInput).toHaveValue('10')

  // Make it
  await wineRecipe.getByRole('button', { name: 'Make' }).click()

  // Switch to Cellar Inventory tab
  await page.getByRole('tab', { name: 'Cellar Inventory' }).click()

  // Verify that cellar is full
  await expect(page.getByText('Capacity: 10 / 10')).toBeVisible()
})
