import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

test('should purchase a cow pen and a cow, verify hugging and selling works', async ({ page }) => {
  // The crops-mature fixture has > $100k
  await loadFixture(page, 'crops-mature')

  // Go to Shop to buy Cow Pen
  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()

  // Switch to the Upgrades tab where the Cow Pen purchase button is located
  await page.getByRole('tab', { name: 'Upgrades' }).click()

  // Buy Cow Pen
  await page.locator('li').filter({ hasText: 'Buy cow pen' }).getByRole('button', { name: 'Buy' }).click()

  // Navigate to Cow Pen
  await page.getByText(': Shop').click()
  await page.getByRole('option', { name: ': Cows' }).click()

  // Buy the cow for sale
  await page.getByRole('button', { name: 'Buy' }).first().click()

  // Assert that we can Hug and Sell the purchased cow in the context menu
  const hugButton = page.getByRole('button', { name: 'Hug' })
  const sellButton = page.getByRole('button', { name: 'Sell' })
  await expect(hugButton).toBeVisible()
  await expect(sellButton).toBeVisible()

  // In CowPen.sass, the animation heart has the class `.fa-heart.animation`.
  // When a cow is hugged, the class `.is-animating` is added to it: `.fa-heart.animation.is-animating`
  // We can just verify this element exists in the DOM after clicking "Hug".
  const animatingHeart = page.locator('.fa-heart.animation.is-animating').first()

  // Click hug
  await hugButton.click()

  // Wait for the animation heart to show up
  await animatingHeart.waitFor({ state: 'attached' })
  await expect(animatingHeart).toBeAttached()

  // Sell the cow
  await sellButton.click()

  // Assert the cow has been sold (Hug/Sell buttons should no longer be visible)
  await expect(hugButton).not.toBeVisible()
  await expect(sellButton).not.toBeVisible()
})
