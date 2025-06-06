import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

test('should not harvest all mature crops when combine harvester is disabled', async ({
  page,
}) => {
  await loadFixture(page, 'combine-harvester-purchased')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Field' }).click()

  await expect(page.locator('.Plot').first()).toMatchAriaSnapshot(`
    - img "Carrot"
  `)
  await page.getByRole('button', { name: 'End the day to save your' }).click()
  await expect(page.locator('.Plot').first()).toMatchAriaSnapshot(`
    - img "Carrot"
  `)
})
