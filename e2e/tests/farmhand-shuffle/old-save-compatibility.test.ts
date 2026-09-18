import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

// bottom-navigation-all-views predates the Farmhand Shuffle feature - it has
// no farmhandShuffle key at all. Loading it should backfill the default
// shape (via createInitialState()'s spread) rather than throwing, and the
// feature should behave as locked/unlocked strictly per that save's own
// level (this fixture's experience is well below level 35, so locked).
test('loading a save with no farmhandShuffle key boots without error and treats the feature as locked', async ({
  page,
}) => {
  const pageErrors: Error[] = []
  page.on('pageerror', error => pageErrors.push(error))

  await loadFixture(page, 'bottom-navigation-all-views')

  await expect(page.locator('.Home')).toBeVisible()

  await page.locator('.view-select').click()
  await expect(
    page.getByRole('option', { name: ': Farmhand Shuffle' })
  ).not.toBeVisible()
  await page.keyboard.press('Escape')

  expect(pageErrors).toEqual([])
})
