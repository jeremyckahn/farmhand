import { expect, test } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

// window.farmhand is a real, supported debug hook (documented in
// README.md's "Debugging" section) but its ambient type declaration lives
// in src/react-app-env.d.ts, which isn't part of this project's
// TypeScript scope - so it's redeclared locally here with the shape this
// file actually relies on.
declare global {
  interface Window {
    farmhand?: {
      setState: (partialState: Record<string, unknown>) => void
    }
  }
}

test('uses server-based price values', async ({ page }) => {
  await loadFixture(page, 'crops-mature')

  // crops-mature's dayCount (6) falls within Spring, carrot's configured
  // high demand season, which would apply a seasonal bonus on top of the
  // fluctuation-adjusted price this test is actually about. Move to a day
  // that's season-neutral for carrot so this test only exercises price
  // fluctuation, not seasonal demand (which has its own dedicated coverage
  // in e2e/tests/seasons.test.ts).
  await page.evaluate(() => window.farmhand?.setState({ dayCount: 20 }))

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
  const adjustedCarrotPrice = (
    Math.round(baseCarrotValue * carrotValueAdjustment * 100) / 100
  ).toFixed(2)

  await expect(page.getByRole('complementary')).toContainText(
    `CarrotSell price: $${adjustedCarrotPrice}Total: $${adjustedCarrotPrice}`
  )
})
