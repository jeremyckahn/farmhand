import { expect, test } from '@playwright/test'

import { openPage } from '../../test-utils/open-page.js'

// Regression coverage for a fixed bug: the class component's
// componentDidUpdate defaulted to the current room in state when the URL's
// match params omitted a room (`params: { room: newRoom = room } = match`),
// but an early functional-refactor pass fell back to DEFAULT_ROOM instead,
// silently bouncing players out of custom rooms. This only manifests as an
// in-app route change (not a full page load, which always re-derives state
// from scratch), so the "room" segment is dropped via a client-side hash
// mutation rather than page.goto.
test('falls back to the current room, not the default room, when the URL omits it', async ({
  page,
}) => {
  await openPage(page)

  // Set the room name before going online so the app connects directly to
  // "party-room" - checking online first would connect to the default room
  // ("global") momentarily, leaving a lingering "Connected to room global!"
  // toast that would otherwise be mistaken for a real fallback-to-default.
  await page.getByLabel('Room name').fill('party-room')
  await page.getByLabel('Room name').press('Enter')

  await expect(page.getByText('Connected to room party-room!')).toBeInViewport({
    timeout: 10_000,
  })
  await expect(
    page.getByRole('checkbox', { name: 'Play online' })
  ).toBeChecked()
  await expect(page.getByLabel('Room name')).toHaveValue('party-room')

  // Drop the room segment from the URL without a full page navigation (a
  // real page.goto/reload would re-derive state from scratch and always
  // fall back to DEFAULT_ROOM, which isn't the scenario being guarded here).
  await page.evaluate(() => {
    window.location.hash = 'online'
  })

  // The room should still reflect the app's own state ("party-room"), not
  // have reverted to the default room just because the URL segment vanished.
  await expect(page.getByLabel('Room name')).toHaveValue('party-room')
  await expect(page.getByText('Connected to room global!')).not.toBeVisible()
})
