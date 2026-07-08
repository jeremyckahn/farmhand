import { expect, test } from '@playwright/test'

import { openPage } from '../../test-utils/open-page.js'

// Regression coverage for a fixed bug: clicking "Play Online" set
// isOnline/redirect in the same update, but the sync-with-path effect ran
// before the router's `path` prop reflected the new route, reverting
// isOnline back to false and firing a spurious "now playing offline"
// notification while a stale-triggered syncToRoom got stuck on "Connecting".
test('going online does not revert to offline before the router catches up', async ({
  page,
}) => {
  await openPage(page)

  await page.getByRole('checkbox', { name: 'Play online' }).check()

  await expect(page.getByText('Connected to room global!')).toBeInViewport({
    timeout: 10_000,
  })

  // The connection should hold, not flicker back to offline immediately
  // after connecting.
  await expect(page.getByText('You are now playing offline.')).not.toBeVisible()
  await expect(
    page.getByRole('checkbox', { name: 'Play online' })
  ).toBeChecked()

  // The URL should have settled on the online route, not reverted.
  expect(page.url()).toContain('online')
})

test('rapidly toggling online/offline settles on the last requested state', async ({
  page,
}) => {
  await openPage(page)

  const onlineToggle = page.getByRole('checkbox', { name: 'Play online' })

  await onlineToggle.check()
  await onlineToggle.uncheck()
  await onlineToggle.check()

  // The final state requested was "online" - the app should settle there
  // rather than getting stuck mid-toggle or reverting to offline.
  await expect(page.getByText('Connected to room global!')).toBeInViewport({
    timeout: 10_000,
  })
  await expect(onlineToggle).toBeChecked()
})
