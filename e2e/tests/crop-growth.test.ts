import { test, expect } from '@playwright/test'

import { openPage } from '../test-utils/open-page.js'

test('should grow watered crops', async ({ page }) => {
  await openPage(page, 0.1)

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()

  // Buy Carrot Seeds
  await page
    .getByRole('tabpanel', { name: 'Seeds' })
    .getByPlaceholder('0')
    .dblclick()
  await page
    .getByRole('tabpanel', { name: 'Seeds' })
    .getByPlaceholder('0')
    .fill('10')
  await page.getByRole('button', { name: 'Buy' }).click()

  // Go to Field
  await page.getByText(': Shop').click()
  await page.getByRole('option', { name: ': Field' }).click()

  // Plant Scarecrow
  await page.getByRole('button', { name: 'Scarecrow' }).click()
  await page
    .locator('.Plot')
    .first()
    .click()

  // Plant Carrot Seed
  await page.getByRole('button', { name: 'Carrot Seed' }).click()
  await page
    .locator('.row > div:nth-child(2)')
    .first()
    .click()

  // Water Carrot Seed
  await page
    .getByRole('button', { name: 'A watering can for hydrating' })
    .click()
  await page
    .locator('.row > div:nth-child(2)')
    .first()
    .click()

  await expect(page.locator('.row > div:nth-child(2)').first())
    .toMatchAriaSnapshot(`
    - img "Carrot Seed"
  `)

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  // Water Carrot Seed
  await page
    .getByRole('button', { name: 'A watering can for hydrating' })
    .click()
  await page
    .locator('.row > div:nth-child(2)')
    .first()
    .click()

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await expect(page.locator('.row > div:nth-child(2)').first())
    .toMatchAriaSnapshot(`
    - img "Carrot"
  `)
})
