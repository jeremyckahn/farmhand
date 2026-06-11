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

  await page.evaluate(() => {
    const checkboxes = document.querySelectorAll('.CowCard input[type="checkbox"]');
    for (const checkbox of checkboxes) {
      if (checkbox.getAttribute('aria-label')?.includes('move')) {
        checkbox.click()
      }
    }
  })

  await page.waitForTimeout(500)

  // Wait, if it didn't move it would be because Grapefruit was moved but Melon wasn't.
  // Wait, Grapefruit's checkbox was clicked by `evaluate`. Melon's was NOT, because Melon doesn't have an aria-label with "move"
  // The aria label for male cow is: "Check this box to move Bull to the breeding pen to mate with a female cow."
  // The aria label for female cow is: ??? Let's just click all checkboxes in the second generic (which is the breed button).
  // Actually, we can click the exact labels we found earlier: `Breed`

  // Move them to breeding pen manually:
  await page.getByText('Breed', { exact: true }).first().click({ force: true })
  await page.waitForTimeout(500)

  await page.getByText('Breed', { exact: true }).first().click({ force: true })
  await page.waitForTimeout(500)

  // End the day 3 times (the gestation period)
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Shift+C')
    await page.waitForTimeout(500)
  }

  // Go back to the Cows tab
  await page.getByRole('tab', { name: 'Cows' }).click()
  await cowsTabPanel.waitFor()

  // the 2 cows return, and 1 calf is born
  await expect(page.getByText('Capacity: 3 / 10')).toBeVisible({ timeout: 5000 })
})
