import { expect, test } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

// window.farmhand is a real, supported debug hook (documented in
// README.md's "Debugging" section) but its ambient type declaration lives
// in src/react-app-env.d.ts, which isn't part of this project's
// TypeScript scope - so it's redeclared locally here with the shape this
// file actually relies on.
declare global {
  interface Window {
    farmhand?: {
      setState: (partialState: Record<string, unknown>) => void
    }
  }
}

// These tests drive the notification system directly through the
// window.farmhand.setState debug hook (documented in README.md's
// "Debugging" section) rather than through repeated real End Day clicks.
// That keeps them focused on NotificationSystem's own behavior and fast/
// deterministic, without unrelated game-economy side effects (loan
// interest, bankruptcy, price events, day-transition timing) that a real
// end-of-day flow would introduce.
const showNotification = (
  page: import('@playwright/test').Page,
  message: string,
  severity: 'info' | 'success' | 'warning' | 'error' = 'info'
) =>
  page.evaluate(
    ({ message, severity }) =>
      window.farmhand?.setState({ latestNotification: { message, severity } }),
    { message, severity }
  )

test('does not stack duplicate toasts when the same notification is triggered rapidly', async ({
  page,
}) => {
  await openPage(page)

  for (let i = 0; i < 5; i++) {
    await showNotification(page, 'Progress saved!')
  }

  await expect(page.getByText('Progress saved!')).toHaveCount(1)
})

test('shows two different notifications concurrently rather than over-deduping', async ({
  page,
}) => {
  await openPage(page)

  await showNotification(page, 'Test notification A')
  await showNotification(page, 'Test notification B')

  await expect(page.getByText('Test notification A')).toBeVisible()
  await expect(page.getByText('Test notification B')).toBeVisible()
})

test('clears a notification after its display duration elapses without crashing the page', async ({
  page,
}) => {
  const pageErrors: string[] = []
  page.on('pageerror', error => pageErrors.push(error.message))

  await openPage(page)

  await showNotification(page, 'Progress saved!')
  await expect(page.getByText('Progress saved!')).toBeVisible()

  // NOTIFICATION_DURATION (src/constants.ts) is 6000ms outside of unit
  // tests. The page's clock is virtualized (see openPage), so this jumps
  // the notification's own auto-hide timer forward instead of a real
  // multi-second wait.
  await page.clock.fastForward(7000)

  await expect(page.getByText('Progress saved!')).toBeHidden()
  expect(pageErrors).toEqual([])

  // Confirm the app is still responsive afterward, not wedged - a new
  // notification should show up normally. A different message is used
  // here since the just-closed one may still be mid-exit-transition in
  // notistack's own internal state for a moment, which would otherwise
  // make this re-trigger an unrelated, separately-timed dedupe race
  // rather than a check of "is the app still responsive".
  await showNotification(page, 'Another notification')
  await expect(page.getByText('Another notification')).toBeVisible()
  expect(pageErrors).toEqual([])
})
