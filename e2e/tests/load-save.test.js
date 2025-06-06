import { test, expect } from '@playwright/test'

import { loadFixture } from '../test-utils/load-fixture.js'
import { openPage } from '../test-utils/open-page.js'

test('should load save file', async ({ page }) => {
  await loadFixture(page, 'crops-mature')

  await expect(page.getByRole('banner')).toContainText('$100,106.30')
})

test('should show overnight notifications from previous day after loading save', async ({
  page,
}) => {
  await openPage(page, 0.3)

  await page.getByRole('button', { name: 'End the day to save your' }).click()

  await expect(page.locator('#root')).toContainText('It rained in the night!')

  await page.reload()

  await expect(page.locator('#root')).toContainText('It rained in the night!')
})

test('should show logs from previous days', async ({ page }) => {
  await loadFixture(page, 'crops-mature')

  await page.getByRole('button', { name: "Open Farmer's Log (l)" }).click()
  await expect(page.locator('#farmers_log-modal-content')).toMatchAriaSnapshot(`
    - heading "Today" [level=3]
    - list:
      - listitem:
        - alert:
          - paragraph: Data loaded!
    - separator
    - list:
      - listitem:
        - heading "Day 6" [level=3]
        - alert:
          - paragraph: It rained in the night!
        - alert:
          - paragraph: /Your loan balance has grown to \\$\\d+\\.\\d+\\./
      - listitem:
        - heading "Day 5" [level=3]
        - alert:
          - paragraph: /Your loan balance has grown to \\$\\d+\\.\\d+\\./
      - listitem:
        - heading "Day 4" [level=3]
        - alert:
          - paragraph: /Your loan balance has grown to \\$\\d+\\.\\d+\\./
      - listitem:
        - heading "Day 3" [level=3]
        - alert:
          - paragraph: /Your loan balance has grown to \\$\\d+\\.\\d+\\./
      - listitem:
        - heading "Day 2" [level=3]
        - alert:
          - paragraph: It rained in the night!
        - alert:
          - paragraph: /Your loan balance has grown to \\$\\d+\\.\\d+\\./
    `)
})
