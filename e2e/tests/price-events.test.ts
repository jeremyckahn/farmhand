import { test, expect } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

// NOTE: This seed was chosen because it produces a carrot price crash on the
// first day end. Price events draw from their own seeded "priceEvents" stream
// (see generatePriceEvents), so this is unaffected by changes to unrelated
// game data such as the item list.
test('should have random price events upon ending day', async ({ page }) => {
  await openPage(page, 2)

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await expect(page.locator('#root')).toContainText(
    'Carrot prices have bottomed out! Avoid selling them until prices return to normal.'
  )
})
