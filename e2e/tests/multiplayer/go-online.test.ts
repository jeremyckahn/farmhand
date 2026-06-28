import { expect, test } from '@playwright/test'
import { openPage } from '../../test-utils/open-page.js'

test('can go online', async ({ page }) => {
  page.on('console', msg =>
    console.log('BROWSER CONSOLE:', msg.type(), msg.text())
  )
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message))
  await openPage(page)

  await page.getByRole('checkbox', { name: 'Play online' }).check()

  await expect(page.getByText('Connected to room global!')).toBeInViewport({
    timeout: 10_000,
  })
})
