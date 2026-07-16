import { test, expect } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

// NOTE: This seed was chosen because it happens to produce a carrot price
// crash under the current seeded RNG sequence (see generateValueAdjustments
// in src/common/utils.ts) - adding or removing an item with
// doesPriceFluctuate: true in itemsMap shifts every subsequent random()
// draw, including this one, and a new seed producing the same event will
// need to be found.
test('should have random price events upon ending day', async ({ page }) => {
  await openPage(page, 0.003)

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await expect(page.locator('#root')).toContainText(
    'Carrot prices have bottomed out! Avoid selling them until prices return to normal.'
  )
})
