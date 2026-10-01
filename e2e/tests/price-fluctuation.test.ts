import { expect, test } from '@playwright/test'

import { getValueAdjustmentStream } from '../../src/utils/getValueAdjustmentStream.js'
import { queueRandomNumbers } from '../test-utils/farmhand-debug-hook.js'
import { openPage } from '../test-utils/open-page.js'

test('should fluctuate crop prices', async ({ page }) => {
  await openPage(page)

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()

  const carrotSeedPrice = page
    .locator('#shop-tabpanel-0 .Item')
    .filter({ hasText: 'Carrot Seed' })
    .getByText(/^Price:/)

  await expect(carrotSeedPrice).toBeVisible()
  const dayOnePrice = await carrotSeedPrice.textContent()

  // Force Carrot Seed's next price adjustment to 0.9 + 0.5 = 1.4x its $15
  // base value (see generateValueAdjustments in src/common/utils.ts).
  await queueRandomNumbers(page, getValueAdjustmentStream('carrot-seed'), [0.9])

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  // NOTE: A short timeout is used here (well under AnimatedNumber's 750ms
  // tween duration) so that this assertion only passes if the price updates
  // synchronously. Without this, Playwright's web-first assertion retry
  // behavior would mask a reintroduced animation by waiting for the tween to
  // finish before re-checking the text.
  await expect(
    page.locator('#shop-tabpanel-0')
  ).toContainText(
    'Carrot SeedPrice: $21.00Total: $21.00In inventory: 0Days to mature: 5',
    { timeout: 200 }
  )

  // Guard against the price already being $21.00 before the day ended, in
  // which case the assertion above wouldn't show that it changed.
  expect(await carrotSeedPrice.textContent()).not.toEqual(dayOnePrice)
})
