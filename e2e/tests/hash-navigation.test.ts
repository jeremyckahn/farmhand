import { test, expect } from '@playwright/test'

import { loadFixture } from '../test-utils/load-fixture.js'

test('reloading the page keeps the current view', async ({ page }) => {
  await loadFixture(page, 'bottom-navigation-all-views')

  await page.getByRole('button', { name: 'Go to Workshop' }).click()
  await expect(page.locator('.Workshop')).toBeVisible()

  await page.reload()

  await expect(page.locator('.Workshop')).toBeVisible()
})

test('reloading the page keeps the current tab on a tabbed screen', async ({
  page,
}) => {
  await loadFixture(page, 'bottom-navigation-all-views')

  await page.getByRole('button', { name: 'Go to Shop' }).click()
  await page.getByRole('tab', { name: 'Upgrades' }).click()
  await expect(
    page.getByRole('tab', { name: 'Upgrades', selected: true })
  ).toBeVisible()

  await page.reload()

  await expect(page.locator('.Shop')).toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'Upgrades', selected: true })
  ).toBeVisible()
})

test('the correct tab is still restored after a real reload where a save loads asynchronously and adds a tab', async ({
  page,
}) => {
  // Regression: on a genuine reload, the current screen mounts once with
  // pre-load default state (e.g. Forest not yet unlocked, hiding Shop's
  // Saplings tab) before the persisted save applies a moment later and
  // Saplings appears - shifting every tab after it over by one. The
  // restored tab needs to track its label through that shift, not freeze
  // at its pre-load index. `loadFixture` alone doesn't persist to
  // localforage, so "End the day" is used here to actually save, making
  // the reload below exercise this race for real.
  await loadFixture(page, 'bottom-navigation-all-views')

  await page.getByRole('button', { name: 'Go to Shop' }).click()
  await page.getByRole('tab', { name: 'Upgrades' }).click()
  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await page.reload()

  await expect(page.locator('.Shop')).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Saplings' })).toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'Upgrades', selected: true })
  ).toBeVisible()
})

test('tab= clears from the URL when navigating to a different view', async ({
  page,
}) => {
  await loadFixture(page, 'bottom-navigation-all-views')

  await page.getByRole('button', { name: 'Go to Shop' }).click()
  await page.getByRole('tab', { name: 'Upgrades' }).click()
  expect(page.url()).toContain('tab=Upgrades')

  await page.getByRole('button', { name: 'Go to Field' }).click()

  expect(page.url()).not.toContain('tab=')
})

test('navigating to a different view preserves an existing online-room hash path', async ({
  page,
}) => {
  await loadFixture(page, 'bottom-navigation-all-views')

  // Simulates already being in an online room (the shape the app's own
  // redirect-to-room flow produces) without depending on a live
  // websocket/tracker connection, which e2e can't reliably exercise here.
  await page.evaluate(() => {
    const { origin, pathname, search } = window.location
    window.history.replaceState(
      {},
      '',
      `${origin}${pathname}${search}#online/test-room`
    )
  })

  await page.getByRole('button', { name: 'Go to Shop' }).click()
  await page.getByRole('tab', { name: 'Upgrades' }).click()

  const url = new URL(page.url())
  const [hashPath, hashQuery] = url.hash.slice(1).split('?')

  expect(hashPath).toEqual('online/test-room')
  expect(new URLSearchParams(hashQuery).get('view')).toEqual('SHOP')
  expect(new URLSearchParams(hashQuery).get('tab')).toEqual('Upgrades')
})
