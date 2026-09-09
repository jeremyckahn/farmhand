import { test, expect } from '@playwright/test'

import { loadFixture } from '../test-utils/load-fixture.js'

test('should display the current season in the header and seasonal demand indicators in the sell list', async ({
  page,
}) => {
  await loadFixture(page, 'seasonal-demand')

  await expect(page.locator('.season-display')).toHaveText('Day 1 of Spring')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Field' }).click()

  const carrotCard = page.locator('.Item').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Carrot$/ }),
  })
  await expect(carrotCard.getByText('In Season')).toBeVisible()
  await expect(carrotCard.getByText('In Season')).toHaveClass('success-text')

  const cornCard = page.locator('.Item').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Corn$/ }),
  })
  await expect(cornCard.getByText('Out of Season')).toBeVisible()
  await expect(cornCard.getByText('Out of Season')).toHaveClass('danger-text')

  const wheatCard = page.locator('.Item').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Wheat$/ }),
  })
  await expect(wheatCard.getByText('In Season')).not.toBeVisible()
  await expect(wheatCard.getByText('Out of Season')).not.toBeVisible()
})

// seasonal-demand's dayCount (0) is SPRING, and its valueAdjustments for
// carrot/corn/wheat are pinned to 1 (no daily fluctuation noise), so each
// crop's sell price is just its base value times its seasonal multiplier:
// carrot (SPRING high demand) 25 * 1.2 = 30, corn (SPRING low demand)
// 70 * 0.8 = 56, wheat (no configured demand) 28 * 1 = 28.
test('should apply the seasonal demand price adjustment when selling crops', async ({
  page,
}) => {
  await loadFixture(page, 'seasonal-demand')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Field' }).click()

  const carrotCard = page.locator('.Item').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Carrot$/ }),
  })
  await expect(carrotCard).toContainText('Sell price: $30.00')
  await expect(carrotCard).toContainText('Total: $30.00')

  const cornCard = page.locator('.Item').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Corn$/ }),
  })
  await expect(cornCard).toContainText('Sell price: $56.00')
  await expect(cornCard).toContainText('Total: $56.00')

  const wheatCard = page.locator('.Item').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Wheat$/ }),
  })
  await expect(wheatCard).toContainText('Sell price: $28.00')
  await expect(wheatCard).toContainText('Total: $28.00')

  // Selling actually credits the seasonally-adjusted price, not just the
  // displayed one - fixture starts at $100.00 with no outstanding loan, so
  // the sale isn't garnished.
  await expect(page.locator('.money-display')).toHaveText('$100.00')

  await carrotCard.getByRole('button', { name: 'Sell' }).click()

  await expect(page.locator('.money-display')).toHaveText('$130.00')
})
