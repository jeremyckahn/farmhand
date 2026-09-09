import { test, expect } from '@playwright/test'

import { loadFixture } from '../test-utils/load-fixture.js'

test('should display the current season in the header and seasonal demand indicators in the sell list', async ({
  page,
}) => {
  await loadFixture(page, 'seasonal-demand')

  await expect(page.locator('.season-display')).toHaveText('Spring')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Field' }).click()

  const carrotCard = page.locator('.Item').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Carrot$/ }),
  })
  await expect(carrotCard.getByText('High Demand')).toBeVisible()

  const cornCard = page.locator('.Item').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Corn$/ }),
  })
  await expect(cornCard.getByText('Low Demand')).toBeVisible()

  const wheatCard = page.locator('.Item').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Wheat$/ }),
  })
  await expect(wheatCard.getByText('High Demand')).not.toBeVisible()
  await expect(wheatCard.getByText('Low Demand')).not.toBeVisible()
})
