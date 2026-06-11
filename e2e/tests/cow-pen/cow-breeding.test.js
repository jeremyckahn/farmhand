import { test, expect } from '@playwright/test'
import { loadFixture } from '../../test-utils/load-fixture.js'

test('should breed two cows to produce a new cow', async ({ page }) => {
  await loadFixture(page, 'cow-breeding')

  await expect(page.getByText('Data loaded!')).toBeHidden({ timeout: 10000 })
  await expect(page.getByText('You achieved "Purchase a Cow Pen!"')).toBeHidden({ timeout: 10000 })

  const navCombo = page.getByRole('combobox').first()
  await navCombo.click()
  await page.getByRole('option', { name: ': Cows' }).click()

  const cowsTabPanel = page.getByRole('tabpanel', { name: 'Cows' })
  await cowsTabPanel.waitFor()

  const cows = cowsTabPanel.locator('.CowCard')
  await expect(cows).toHaveCount(2)

  await page.evaluate(() => {
    const checkboxes = document.querySelectorAll('.CowCard input[type="checkbox"]');
    for (const checkbox of checkboxes) {
      if (checkbox.getAttribute('aria-label')?.includes('move')) {
        checkbox.click()
      } else {
        const label = checkbox.closest('label');
        if (label && label.textContent.includes('Breed')) {
          checkbox.click();
        } else {
            const parent = checkbox.parentElement?.parentElement;
            if (parent && parent.textContent.includes('Breed')) {
                checkbox.click();
            }
        }
      }
    }
  })

  await page.waitForTimeout(500)

  await page.getByRole('tab', { name: 'Breeding Pen' }).click()
  const breedingPenPanel = page.getByRole('tabpanel', { name: 'Breeding Pen' })
  await breedingPenPanel.waitFor()

  const breedingCows = breedingPenPanel.locator('.CowCard')
  await expect(breedingCows).toHaveCount(2)

  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Shift+C')
    await page.waitForTimeout(500)
  }

  await page.getByRole('tab', { name: 'Cows' }).click()
  await cowsTabPanel.waitFor()

  await expect(cows).toHaveCount(3, { timeout: 10000 })
})
