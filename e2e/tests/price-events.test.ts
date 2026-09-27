import { test, expect } from '@playwright/test'

import { randomStream } from '../../src/enums.js'
import { queueRandomNumbers } from '../test-utils/farmhand-debug-hook.js'
import { openPage } from '../test-utils/open-page.js'

test('should have random price events upon ending day', async ({ page }) => {
  await openPage(page)

  // Force a price event on the next day end: an event happens (below
  // PRICE_EVENT_CHANCE), it's for the first unlocked crop (carrot), and it's a
  // crash (below 0.5).
  await queueRandomNumbers(page, randomStream.PRICE_EVENT_CHANCE, [0])
  await queueRandomNumbers(page, randomStream.PRICE_EVENT_CROP, [0])
  await queueRandomNumbers(page, randomStream.PRICE_EVENT_TYPE, [0])

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await expect(page.locator('#root')).toContainText(
    'Carrot prices have bottomed out! Avoid selling them until prices return to normal.'
  )
})
