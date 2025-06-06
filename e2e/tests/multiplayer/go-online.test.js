import { expect, test } from '@playwright/test'

import { openPage } from '../../test-utils/open-page.js'

test('can go online', async ({ page }) => {
  await openPage(page)

  await page.getByRole('checkbox', { name: 'Play online' }).check()

  await expect(page.getByText('Connected to room global!')).toBeInViewport({
    timeout: 10_000,
  })
})
