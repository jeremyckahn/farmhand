import { expect, test } from '@playwright/test'

import { NOTIFICATION_DURATION } from '../../src/constants.js'
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

// The "Test notification A/B" and display-duration tests below drive the
// notification system directly through the window.farmhand.setState debug
// hook (documented in README.md's "Debugging" section) rather than through
// real game actions. That keeps them focused on NotificationSystem's own
// generic dedup/lifecycle behavior and fast/deterministic, without
// unrelated game-economy side effects (loan interest, bankruptcy, price
// events, day-transition timing) that a real end-of-day flow would
// introduce.
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

const endDay = (page: import('@playwright/test').Page) =>
  page.getByRole('button', { name: 'End the day to save your' }).click()

test('does not stack duplicate toasts when the same notification is triggered rapidly', async ({
  page,
}) => {
  await openPage(page)

  // Unlike the other tests in this file, this one drives the real
  // showNotification reducer (src/game-logic/reducers/showNotification.ts)
  // through repeated "End the day" clicks instead of the debug hook. That
  // reducer is the actual root cause this fix addresses: it always builds
  // a brand new `latestNotification` object on every call, so this test
  // needs the real object-identity churn a live day-advancement cycle
  // produces (handleClickEndDayButton -> incrementDay -> the reducer) -
  // injecting an equivalent-looking object via setState wouldn't exercise
  // that. Clicking End Day back-to-back without waiting reproduces the
  // rapid-clicking bug report, where each cycle's "Progress saved!" call
  // could re-fire while an identical toast from a prior cycle was still
  // visible.
  for (let i = 0; i < 5; i++) {
    await endDay(page)
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

  // The page's clock is virtualized (see openPage), so this jumps the
  // notification's own auto-hide timer forward instead of a real
  // multi-second wait. The extra 1000ms is just a margin past the
  // notification's actual configured duration.
  await page.clock.fastForward(NOTIFICATION_DURATION + 1000)

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
