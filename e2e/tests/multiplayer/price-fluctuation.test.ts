import { expect, test } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'
import { setFarmhandState } from '../../test-utils/farmhand-debug-hook.js'

test('uses server-based price values', async ({ page }) => {
  await loadFixture(page, 'crops-mature')

  // crops-mature's dayCount (6) falls within Spring, carrot's configured
  // high demand season, which would apply a seasonal bonus on top of the
  // fluctuation-adjusted price this test is actually about. Move to a day
  // that's season-neutral for carrot so this test only exercises price
  // fluctuation, not seasonal demand (which has its own dedicated coverage
  // in e2e/tests/seasons.test.ts).
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
  await expect(page.getByRole('complementary')).toContainText(
    'CarrotSell price: $28.72Total: $28.72'
  )
  // Register the response listener before triggering the request. Otherwise a
  // fast API server can respond before the listener exists, and the test hangs.
  const marketDataResponse = page.waitForResponse(response =>
    response.url().includes('/api/get-market-data')
  )
  await page.getByRole('checkbox', { name: 'Play online' }).check()

  const serverResponse: {
    valueAdjustments: {
      carrot: number
    }
  } = await (await marketDataResponse).json()

  const { carrot: carrotValueAdjustment } = serverResponse.valueAdjustments
  const baseCarrotValue = 25
  const adjustedCarrotPrice = (
    Math.round(baseCarrotValue * carrotValueAdjustment * 100) / 100
  ).toFixed(2)

  await expect(page.getByRole('complementary')).toContainText(
    `CarrotSell price: $${adjustedCarrotPrice}Total: $${adjustedCarrotPrice}`
  )
})
