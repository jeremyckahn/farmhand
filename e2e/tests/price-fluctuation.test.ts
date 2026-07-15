import { expect, test } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

// NOTE: These hardcoded prices are derived from the seeded RNG at the
// default seed. They're sensitive to the number and order of items with
// doesPriceFluctuate: true in itemsMap (see generateValueAdjustments in
// src/common/utils.ts) - adding or removing such an item shifts every
// subsequent random() draw, including this one, and these values will need
// to be regenerated.
test('should fluctuate crop prices', async ({ page }) => {
  await openPage(page)

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()
  await expect(page.locator('#shop-tabpanel-0')).toContainText(
    'Carrot SeedPrice: $14.65Total: $14.65In inventory: 0Days to mature: 5'
  )
  await page.getByRole('button', { name: 'End the day to save your' }).click()
  await expect(page.locator('#shop-tabpanel-0')).toContainText(
    'Carrot SeedPrice: $15.23Total: $15.23In inventory: 0Days to mature: 5'
  )
})
