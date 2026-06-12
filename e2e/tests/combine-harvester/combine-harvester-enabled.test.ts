import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

test('should harvest all mature crops when combine harvester is enabled', async ({
  page,
}) => {
  await loadFixture(page, 'combine-harvester-purchased')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Field' }).click()
  await page
    .getByRole('checkbox', { name: 'Automatically harvest crops' })
    .check()

  await expect(page.locator('.Plot').first()).toMatchAriaSnapshot(`
    - img "Carrot"
  `)
  await page.getByRole('button', { name: 'End the day to save your' }).click()
  await expect(page.locator('.Plot').first()).toMatchAriaSnapshot(`
    - img "Empty plot"
  `)
})
