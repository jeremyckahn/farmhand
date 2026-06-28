import { expect, test } from '@playwright/test'

import { openPage } from '../../test-utils/open-page.js'

test('shows network error when attempting to end day in multiplayer while offline', async ({
  page,
  context,
}) => {
  await openPage(page)

  await page.getByRole('checkbox', { name: 'Play online' }).check()

  await expect(page.getByText('Connected to room global!')).toBeInViewport({
    timeout: 10_000,
  })

  await context.setOffline(true)

  await page.getByRole('button', { name: 'End the day to save your' }).click()
  await page.getByRole('button', { name: "Open Farmer's Log (l)" }).click()

  await expect(
    page.locator('#root')
  ).toContainText(
    'There was an issue connecting to the server. Please try again in a moment.',
    { timeout: 10_000 }
  )
})
