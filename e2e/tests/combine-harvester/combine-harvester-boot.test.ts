import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'

// Regression coverage for a documented, intentional behavior change: the
// class component only auto-harvested via the combine on boot once per
// queued newDayNotifications entry (and not at all when there were none).
// The functional refactor now runs the auto-harvest unconditionally, exactly
// once, whenever isCombineEnabled is true on boot - including when there are
// no pending day notifications at all, which is the case exercised here
// (the switch is enabled and the game is saved directly, without ending a
// day, so newDayNotifications stays empty).
test('auto-harvests on boot even with no pending day notifications', async ({
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

  await page.getByRole('button', { name: 'View Settings (comma)' }).click()
  await page.getByRole('button', { name: 'Save Game' }).click()
  await expect(page.getByText('Progress saved!')).toBeVisible()

  await page.reload()

  // stageFocus isn't a persisted key, so boot lands back on Home - navigate
  // to Field again to check the plot.
  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Field' }).click()

  await expect(page.locator('.Plot').first()).toMatchAriaSnapshot(`
    - img "Empty plot"
  `)
})
