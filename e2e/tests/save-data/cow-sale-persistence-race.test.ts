import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'
import { simulateServerError } from '../../test-utils/simulate-server-error.js'

// Regression coverage for a fixed bug: selling a cow and then immediately
// ending the day could race with the day-advancement/persistence flow such
// that the sale wasn't reflected in what got saved to localForage, so a
// reload could show the sold cow as still owned.
test('a cow sale immediately followed by ending the day is persisted correctly', async ({
  page,
}) => {
  // The crops-mature fixture has > $100k
  await loadFixture(page, 'crops-mature')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()
  await page.getByRole('tab', { name: 'Upgrades' }).click()
  await page
    .locator('li')
    .filter({ hasText: 'Buy cow pen' })
    .getByRole('button', { name: 'Buy' })
    .click()

  await page.getByText(': Shop').click()
  await page.getByRole('option', { name: ': Cows' }).click()
  await page
    .getByRole('button', { name: 'Buy' })
    .first()
    .click()

  const sellButton = page.getByRole('button', { name: 'Sell' })
  await expect(sellButton).toBeVisible()

  // Sell, then immediately end the day without waiting for the sale to
  // settle first.
  await sellButton.click()
  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await expect(page.getByText('Progress saved!')).toBeVisible()

  await page.reload()

  // The current view (Cows) is restored automatically from the URL hash on
  // reload, so no need to navigate there again.
  await expect(page.getByRole('button', { name: 'Sell' })).not.toBeVisible()
})

test('a cow sale immediately followed by an end-of-day server error is still persisted correctly', async ({
  page,
}) => {
  await loadFixture(page, 'crops-mature')

  await page.getByRole('checkbox', { name: 'Play online' }).check()
  await expect(page.getByText('Connected to room global!')).toBeInViewport({
    timeout: 10_000,
  })

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()
  await page.getByRole('tab', { name: 'Upgrades' }).click()
  await page
    .locator('li')
    .filter({ hasText: 'Buy cow pen' })
    .getByRole('button', { name: 'Buy' })
    .click()

  await page.getByText(': Shop').click()
  await page.getByRole('option', { name: ': Cows' }).click()
  await page
    .getByRole('button', { name: 'Buy' })
    .first()
    .click()

  const sellButton = page.getByRole('button', { name: 'Sell' })
  await expect(sellButton).toBeVisible()

  await simulateServerError(page, '**/post-day-results*')

  await sellButton.click()
  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await page.getByRole('button', { name: "Open Farmer's Log (l)" }).click()
  await expect(
    page.locator('#root')
  ).toContainText(
    'There was an issue connecting to the server. Please try again in a moment.',
    { timeout: 10_000 }
  )

  await page.reload()

  // The current view (Cows) is restored automatically from the URL hash on
  // reload, so no need to navigate there again.
  await expect(page.getByRole('button', { name: 'Sell' })).not.toBeVisible()
})
