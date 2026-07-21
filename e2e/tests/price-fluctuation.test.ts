import { expect, test } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

// NOTE: These hardcoded prices are derived from the seeded RNG at the
// default seed. They're sensitive to the number and order of items with
// doesPriceFluctuate: true in itemsMap (see generateValueAdjustments in
// src/common/utils.ts) - adding or removing such an item shifts every
// subsequent random() draw, including this one, and these values will need
// to be regenerated.
test('should fluctuate crop prices', async ({ page }) => {
  await openPage(page)

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()
  await expect(page.locator('#shop-tabpanel-0')).toContainText(
    'Carrot SeedPrice: $17.73Total: $17.73In inventory: 0Days to mature: 5'
  )
  // Carrot Seed's price is rendered via AnimatedNumber, which tweens the
  // displayed value over 750ms via requestAnimationFrame - reading it right
  // after "End the day" races that live animation. Pausing the clock right
  // at this instant (it otherwise free-runs in real time - see
  // open-page.ts) and then running it forward past the tween's duration
  // makes the read deterministic instead. Scoped to just this moment so it
  // doesn't affect earlier nav-menu transitions, which rely on real timers -
  // a real (not fake-clock) wait first ensures the nav combobox's own
  // closing transition has actually finished before we take over the clock,
  // otherwise pausing mid-transition leaves its backdrop stuck forever.
  await page.waitForTimeout(500)
  await page.clock.pauseAt(await page.evaluate(() => Date.now()))
  await page.getByRole('button', { name: 'End the day to save your' }).click()
  await page.clock.runFor(800)
  await expect(page.locator('#shop-tabpanel-0')).toContainText(
    'Carrot SeedPrice: $18.23Total: $18.23In inventory: 0Days to mature: 5'
  )
})
