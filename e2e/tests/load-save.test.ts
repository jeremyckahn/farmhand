import { test, expect } from '@playwright/test'

import { randomStream } from '../../src/enums.js'
import { queueRandomNumbers } from '../test-utils/farmhand-debug-hook.js'
import { loadFixture } from '../test-utils/load-fixture.js'
import { openPage } from '../test-utils/open-page.js'

test('should load save file', async ({ page }) => {
  await loadFixture(page, 'crops-mature')

  await expect(page.getByRole('banner')).toContainText('$100,106.30')
})

test('should show overnight notifications from previous day after loading save', async ({
  page,
}) => {
  await openPage(page)

  // Force rain on the next day end: it precipitates (below
  // PRECIPITATION_CHANCE) but doesn't storm (not below STORM_CHANCE).
  await queueRandomNumbers(page, randomStream.PRECIPITATION, [0])
  await queueRandomNumbers(page, randomStream.STORM, [0.99])

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
