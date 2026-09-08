import { test, expect } from '@playwright/test'

import { loadFixture } from '../test-utils/load-fixture.js'

test('clicking a view icon navigates directly to that view', async ({
  page,
}) => {
  await loadFixture(page, 'bottom-navigation-all-views')

  await page.getByRole('button', { name: 'Go to Workshop' }).click()

  await expect(page.locator('.Workshop')).toBeVisible()
})

test('the active view button is marked current, and only that one', async ({
  page,
}) => {
  await loadFixture(page, 'bottom-navigation-all-views')

  const homeButton = page.getByRole('button', { name: 'Go to Home' })
  const workshopButton = page.getByRole('button', { name: 'Go to Workshop' })

  await expect(homeButton).toHaveAttribute('aria-current', 'true')
  await expect(workshopButton).not.toHaveAttribute('aria-current')

  await workshopButton.click()

  await expect(workshopButton).toHaveAttribute('aria-current', 'true')
  await expect(homeButton).not.toHaveAttribute('aria-current')
})

test('all view buttons stay visible at a narrow viewport with every view unlocked', async ({
  page,
}) => {
  await loadFixture(page, 'bottom-navigation-all-views')
  await page.setViewportSize({ width: 320, height: 640 })

  for (const label of [
    'Go to Home',
    'Go to Shop',
    'Go to Field',
    'Go to Forest',
    'Go to Cows',
    'Go to Workshop',
    'Go to Cellar',
  ]) {
    await expect(page.getByRole('button', { name: label })).toBeVisible()
  }
})

test('the view button row does not overlap the Field toolbelt in portrait orientation', async ({
  page,
}) => {
  await loadFixture(page, 'bottom-navigation-all-views')
  await page.setViewportSize({ width: 375, height: 667 })

  await page.getByRole('button', { name: 'Go to Field' }).click()

  const toolbeltBox = await page.locator('.Toolbelt').boundingBox()
  const viewButtonBox = await page
    .getByRole('button', { name: 'Go to Field' })
    .boundingBox()

  if (!toolbeltBox || !viewButtonBox) {
    throw new Error('Expected both the toolbelt and view buttons to render.')
  }

  expect(toolbeltBox.y + toolbeltBox.height).toBeLessThanOrEqual(
    viewButtonBox.y
  )
})
