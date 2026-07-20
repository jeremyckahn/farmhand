import { test } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

// Temporary probe to regenerate RNG-dependent E2E fixtures/seeds after the
// Banana tree shifted itemsMap iteration order. Not part of the permanent
// suite - will be removed once real values are captured from CI output.

test('probe: seed=0.5 day-1 and day-2 shop price text', async ({ page }) => {
  await openPage(page)

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()

  const day1Text = await page.locator('#shop-tabpanel-0').innerText()
  console.log(`PROBE_DAY1::${day1Text}`)

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  const day2Text = await page.locator('#shop-tabpanel-0').innerText()
  console.log(`PROBE_DAY2::${day2Text}`)
})

const RAIN_SEED_CANDIDATES = Array.from(
  { length: 50 },
  (_, i) => Math.round((i + 1) * 1000) / 1000000
)

for (const seed of RAIN_SEED_CANDIDATES) {
  test(`probe: rain seed=${seed}`, async ({ page }) => {
    await openPage(page, seed)
    await page.getByRole('button', { name: 'End the day to save your' }).click()

    const text = await page.locator('#root').innerText()

    if (text.includes('It rained in the night!')) {
      console.log(`RAIN_MATCH::${seed}`)
    }
  })
}

const CRASH_SEED_CANDIDATES = Array.from(
  { length: 50 },
  (_, i) => Math.round((i + 1) * 1000) / 1000000 + 0.05
)

for (const seed of CRASH_SEED_CANDIDATES) {
  test(`probe: crash seed=${seed}`, async ({ page }) => {
    await openPage(page, seed)
    await page.getByRole('button', { name: 'End the day to save your' }).click()

    const text = await page.locator('#root').innerText()

    if (text.includes('Carrot prices have bottomed out!')) {
      console.log(`CRASH_MATCH::${seed}`)
    }
  })
}
