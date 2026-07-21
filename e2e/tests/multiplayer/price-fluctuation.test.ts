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

  // The sell price is rendered via AnimatedNumber, which tweens the
  // displayed value over 750ms via requestAnimationFrame - reading it right
  // after the server pushes a new value races that live animation under a
  // slow/contended CI runner. Pausing the clock right at this instant (it
  // otherwise free-runs in real time - see open-page.ts) and then running
  // it forward past the tween's duration makes the read deterministic
  // instead. A real (not fake-clock) wait first ensures any in-flight
  // nav-menu transition has actually finished before we take over the
  // clock, otherwise pausing mid-transition leaves its backdrop stuck.
  await page.waitForTimeout(500)
  await page.clock.pauseAt(await page.evaluate(() => Date.now()))
  await page.clock.runFor(800)

  await expect(page.getByRole('complementary')).toContainText(
    `CarrotSell price: $${adjustedCarrotPrice}Total: $${adjustedCarrotPrice}`
  )
})
