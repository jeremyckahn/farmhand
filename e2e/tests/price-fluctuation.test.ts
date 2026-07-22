import { expect, test } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

// NOTE: These hardcoded prices are derived from the seeded RNG at the
// default seed. They're sensitive to the number and order of items with
// doesPriceFluctuate: true in itemsMap (see generateValueAdjustments in
// src/common/utils.ts) - adding or removing such an item shifts every
// subsequent random() draw, including this one, and these values will need
// to be regenerated. The pre- and post-end-of-day prices are expected to
// differ, since ending the day draws a fresh set of value adjustments from
// the same seeded generator (see adjustItemValues in
// computeStateForNextDay.ts).
test('should fluctuate crop prices', async ({ page }) => {
  await openPage(page)

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()
  await expect(page.locator('#shop-tabpanel-0')).toContainText(
    'Carrot SeedPrice: $21.60Total: $21.60In inventory: 0Days to mature: 5'
  )
  await page.getByRole('button', { name: 'End the day to save your' }).click()

  // NOTE: A short timeout is used here (well under AnimatedNumber's 750ms
  // tween duration) so that this assertion only passes if the price updates
  // synchronously. Without this, Playwright's web-first assertion retry
  // behavior would mask a reintroduced animation by waiting for the tween to
  // finish before re-checking the text.
  await expect(page.locator('#shop-tabpanel-0')).toContainText(
    'Carrot SeedPrice: $18.23Total: $18.23In inventory: 0Days to mature: 5',
    { timeout: 200 }
  )
})
