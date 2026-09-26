import { test, expect } from '@playwright/test'

import { queueRandomNumbers } from '../test-utils/farmhand-debug-hook.js'
import { openPage } from '../test-utils/open-page.js'

test('should have random price events upon ending day', async ({ page }) => {
  await openPage(page)

  // Force a price event on the next day end: the first draw is below
  // PRICE_EVENT_CHANCE (so an event happens), the second picks the first
  // unlocked crop (carrot), and the third is below 0.5 (so it's a crash).
  await queueRandomNumbers(page, 'priceEvents', [0, 0, 0])

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await expect(page.locator('#root')).toContainText(
    'Carrot prices have bottomed out! Avoid selling them until prices return to normal.'
  )
})
