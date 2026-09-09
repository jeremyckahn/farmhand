import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

test('should track and manage revenue records', async ({ page }) => {
  await loadFixture(page, 'crops-mature')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Field' }).click()
  await page
    .getByRole('button', { name: 'A scythe for crop harvesting' })
    .click()
  await page
    .locator('.Plot')
    .first()
    .click()
  await page
    .getByRole('button', { name: 'Sell' })
    .first()
    .click()
  // crops-mature's dayCount (6) falls within Spring, carrot's configured
  // high demand season, so the sold carrot's base revenue ($27.28) is
  // boosted by SEASON_HIGH_DEMAND_BONUS to $33.02.
  await page.getByRole('button', { name: 'View your stats (s)' }).click()
  await expect(page.locator('#stats-modal-content')).toContainText(
    "Today's Revenue$33.02Today's Losses$0.00Today's Profit$33.02Record Single Day Profit$33.02Current Profitability Streak0 daysRecord Profitability Streak0 days7-day Profit Average-$20.53Record 7-day Profit Average$0.00All-Time Total Revenue$33.02"
  )
  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByRole('button', { name: 'End the day to save your' }).click()
  await page.getByRole('button', { name: 'View your stats (s)' }).click()
  await expect(page.locator('#stats-modal-content')).toContainText(
    "Today's Revenue$0.00Today's Losses$0.00Today's Profit$0.00Record Single Day Profit$33.02Current Profitability Streak1 dayRecord Profitability Streak1 day7-day Profit Average-$15.81Record 7-day Profit Average$0.00All-Time Total Revenue$33.02"
  )
})
