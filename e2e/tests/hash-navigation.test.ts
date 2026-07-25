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
