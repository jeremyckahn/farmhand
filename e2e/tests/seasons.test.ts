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
