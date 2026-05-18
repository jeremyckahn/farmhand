import { expect, test } from '@playwright/test'
import { loadFixture } from '../test-utils/load-fixture.js'

test.describe('Forest unlock investigation', () => {
  test('does NOT show forest notification at level 15 when flag is off', async ({ page }) => {
    await loadFixture(page, 'near-level-15')

    await page.evaluate(() => {
        window.farmhand.setState({ experience: 19599 });
    });

    await page.getByRole('button', { name: 'Open Farmer\'s Log (l)' }).click()
    await page.getByRole('button', { name: 'Close' }).click()

    await page.getByRole('button', { name: 'End the day to save your' }).click()

    await expect(page.getByText('level: 15')).toBeVisible()

    await expect(page.getByText('You reached level 15!')).toBeVisible()
    await expect(page.getByText('The Forest is now available!')).not.toBeVisible()
  })

  test('correctly hides forest notification at level 15 when enable_FOREST=false is used', async ({ page }) => {
    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    await page.goto(`${appUrl}?enable_FOREST=false`)

    await expect(page.getByRole('button', { name: 'View Settings (comma)' })).toBeVisible()

    await page.evaluate(() => {
        window.farmhand.setState({ experience: 19599 });
    });

    await page.getByRole('button', { name: 'End the day to save your' }).click()

    await expect(page.getByText('level: 15')).toBeVisible()

    await expect(page.getByText('The Forest is now available!')).not.toBeVisible()
  })
})
