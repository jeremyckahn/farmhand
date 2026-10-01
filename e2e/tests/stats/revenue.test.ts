import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'
import { setFarmhandState } from '../../test-utils/farmhand-debug-hook.js'

test('should track and manage revenue records', async ({ page }) => {
  await loadFixture(page, 'crops-mature')

  // crops-mature's dayCount (6) falls within Spring, carrot's configured
  // high demand season, which would apply a seasonal bonus on top of the
  // revenue values this test is actually about. Move to a day that's
  // season-neutral for carrot so this test only exercises revenue
  // tracking, not seasonal demand (which has its own dedicated coverage in
  // e2e/tests/seasons.test.ts).
  await setFarmhandState(page, { dayCount: 20 })

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
  await page.getByRole('button', { name: 'View your stats (s)' }).click()
  await expect(page.locator('#stats-modal-content')).toContainText(
    "Today's Revenue$27.28Today's Losses$0.00Today's Profit$27.28Record Single Day Profit$27.28Current Profitability Streak0 daysRecord Profitability Streak0 days7-day Profit Average-$20.53Record 7-day Profit Average$0.00All-Time Total Revenue$27.28"
  )
  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByRole('button', { name: 'End the day to save your' }).click()
  await page.getByRole('button', { name: 'View your stats (s)' }).click()
  await expect(page.locator('#stats-modal-content')).toContainText(
    "Today's Revenue$0.00Today's Losses$0.00Today's Profit$0.00Record Single Day Profit$27.28Current Profitability Streak1 dayRecord Profitability Streak1 day7-day Profit Average-$16.63Record 7-day Profit Average$0.00All-Time Total Revenue$27.28"
  )
})
