import { expect, test } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'
import { SEASON_HIGH_DEMAND_BONUS } from '../../../src/constants.js'

test('uses server-based price values', async ({ page }) => {
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
  // crops-mature's dayCount (6) falls within Spring, carrot's configured
  // high demand season, so the base fluctuation-adjusted price ($28.72) is
  // boosted by SEASON_HIGH_DEMAND_BONUS.
  await expect(page.getByRole('complementary')).toContainText(
    'CarrotSell price: $34.46Total: $34.46'
  )
  await page.getByRole('checkbox', { name: 'Play online' }).check()

  const serverResponse = await new Promise<{
    valueAdjustments: {
      carrot: number
    }
  }>((resolve, reject) => {
    page.on('response', async response => {
      try {
        resolve(await response.json())
      } catch (error) {
        reject(error)
      }
    })
  })

  const { carrot: carrotValueAdjustment } = serverResponse.valueAdjustments
  const baseCarrotValue = 25
  const fluctuationAdjustedCarrotPrice =
    Math.round(baseCarrotValue * carrotValueAdjustment * 100) / 100
  // Still Spring (see note above), so the seasonal bonus still applies to
  // the server-supplied price.
  const adjustedCarrotPrice = (
    fluctuationAdjustedCarrotPrice *
    (1 + SEASON_HIGH_DEMAND_BONUS)
  ).toFixed(2)

  await expect(page.getByRole('complementary')).toContainText(
    `CarrotSell price: $${adjustedCarrotPrice}Total: $${adjustedCarrotPrice}`
  )
})
