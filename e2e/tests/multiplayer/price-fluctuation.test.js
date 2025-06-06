import { expect, test } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

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
  await expect(page.getByRole('complementary')).toContainText(
    'CarrotSell price: $28.72Total: $28.72'
  )
  await page.getByRole('checkbox', { name: 'Play online' }).check()

  const serverResponse = await new Promise((resolve, reject) => {
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
