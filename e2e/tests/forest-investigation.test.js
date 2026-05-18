import { expect, test } from '@playwright/test'
import { loadFixture } from '../test-utils/load-fixture.js'

test.describe('Forest unlock investigation', () => {
  test('does NOT show forest notification at level 15 when flag is off', async ({ page }) => {
    // Level 15 needs (15-1)*10 = 140^2 = 19600 experience.
    // Level 14 needs (14-1)*10 = 130^2 = 16900 experience.
    await loadFixture(page, 'near-level-15')

    // Set experience to just below level 15
    await page.evaluate(() => {
        window.farmhand.setState({ experience: 19599 });
    });

    // Sell something to gain 1 experience and reach level 15
    await page.getByRole('button', { name: 'View Inventory (i)' }).click()
    await page.getByText('Carrot Seed').first().click()
    await page.getByRole('button', { name: 'Sell' }).click()

    // Verify level 15 reached
    await expect(page.getByText('level: 15')).toBeVisible()

    // Verify notification content
    await expect(page.getByText('You reached level 15!')).toBeVisible()
    await expect(page.getByText('The Forest is now available!')).not.toBeVisible()
  })

  test('correctly hides forest notification at level 15 when enable_FOREST=false is used', async ({ page }) => {
    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    await page.goto(`${appUrl}?enable_FOREST=false`)

    // Ensure the app is loaded before evaluating
    await expect(page.getByRole('button', { name: 'View Settings (comma)' })).toBeVisible()

    await page.evaluate(() => {
        const state = {
            experience: 19599,
            inventory: [{ id: 'carrot-seed', quantity: 10 }],
            money: 1000,
            showNotifications: true,
            todaysNotifications: [],
            inventoryLimit: 100,
            toolLevels: {
                HOE: 'DEFAULT',
                SCYTHE: 'DEFAULT',
                SHOVEL: 'UNAVAILABLE',
                WATERING_CAN: 'DEFAULT'
            }
        };
        window.farmhand.setState(state);
    });

    await page.getByRole('button', { name: 'View Inventory (i)' }).click()
    await page.getByText('Carrot Seed').first().click()
    await page.getByRole('button', { name: 'Sell' }).click()

    await expect(page.getByText('level: 15')).toBeVisible()

    // After the fix, this should NOT be visible
    await expect(page.getByText('The Forest is now available!')).not.toBeVisible()
  })
})
