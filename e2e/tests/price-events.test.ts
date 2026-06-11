import { test, expect } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

test('should have random price events upon ending day', async ({ page }) => {
  await openPage(page, 0.3)

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await expect(page.locator('#root')).toContainText(
    'Carrot prices have bottomed out! Avoid selling them until prices return to normal.'
  )
})
