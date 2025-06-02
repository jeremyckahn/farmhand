import { expect, test } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

test('should fluctuate crop prices', async ({ page }) => {
  await openPage(page)

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()
  await expect(page.locator('#shop-tabpanel-0')).toContainText(
    'Carrot SeedPrice: $14.37Total: $14.37In inventory: 0Days to mature: 5'
  )
  await page.getByRole('button', { name: 'End the day to save your' }).click()
  await expect(page.locator('#shop-tabpanel-0')).toContainText(
    'Carrot SeedPrice: $20.95Total: $20.95In inventory: 0Days to mature: 5'
  )
})
