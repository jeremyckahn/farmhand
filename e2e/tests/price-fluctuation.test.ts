import { expect, test } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

// NOTE: These hardcoded prices are derived from the seeded RNG at the
// default seed. Each item's price adjustment draws from its own seeded
// stream (see generateValueAdjustments in src/common/utils.ts), so these only
// need to be regenerated if Carrot Seed's own value changes.
test('should fluctuate crop prices', async ({ page }) => {
  await openPage(page)

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()
  await expect(page.locator('#shop-tabpanel-0')).toContainText(
    'Carrot SeedPrice: $8.92Total: $8.92In inventory: 0Days to mature: 5'
  )
  await page.getByRole('button', { name: 'End the day to save your' }).click()

  // NOTE: A short timeout is used here (well under AnimatedNumber's 750ms
  // tween duration) so that this assertion only passes if the price updates
  // synchronously. Without this, Playwright's web-first assertion retry
  // behavior would mask a reintroduced animation by waiting for the tween to
  // finish before re-checking the text.
  await expect(
    page.locator('#shop-tabpanel-0')
  ).toContainText(
    'Carrot SeedPrice: $8.41Total: $8.41In inventory: 0Days to mature: 5',
    { timeout: 200 }
  )
})
