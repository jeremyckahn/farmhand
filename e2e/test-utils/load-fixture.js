import { expect } from '@playwright/test'

import { openPage } from './open-page.js'

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} fixtureName - Should not include file path or suffix.
 */
export async function loadFixture(page, fixtureName) {
  await openPage(page)

  await page.getByRole('button', { name: 'View Settings (comma)' }).click()
  await page.getByRole('button', { name: 'Load game data that was' }).click()
  await page
    .locator('input[type=file]')
    .setInputFiles(`/home/pwuser/e2e/fixtures/${fixtureName}.json`)

  await expect(page.getByText('Data loaded!')).toBeVisible()
}
