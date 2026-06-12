import { test, expect } from '@playwright/test'

import { openPage } from '../../test-utils/open-page.js'

test('should load saved game', async ({ page }) => {
  await openPage(page)

  await page
    .getByLabel('End the day to save your progress and advance the game.')
    .first()
    .click()

  const notificationLocator = page.getByText('Your loan balance has grown to', {
    exact: false,
  })
  await expect(notificationLocator).toBeVisible()

  await page.reload()

  // Assert that the notification is visible again after reload
  const notificationAfterReload = page.getByText(
    'Your loan balance has grown to',
    { exact: false }
  )
  await expect(notificationAfterReload).toBeVisible()
})
