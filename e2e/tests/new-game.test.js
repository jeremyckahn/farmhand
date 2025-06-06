import { expect, test } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

test('shows new game notifications', async ({ page }) => {
  await openPage(page)

  await expect(
    page.getByText('You took out a new loan. Your current balance is $500.00.')
  ).toBeInViewport()
})
