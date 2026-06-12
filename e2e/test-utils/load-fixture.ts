import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect } from '@playwright/test'

import { openPage } from './open-page.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    .setInputFiles(path.join(__dirname, '..', 'fixtures', `${fixtureName}.json`))

  await expect(page.getByText('Data loaded!')).toBeVisible()
}
