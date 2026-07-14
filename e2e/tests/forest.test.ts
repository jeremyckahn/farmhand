import { test, expect } from '@playwright/test'

import { loadFixture } from '../test-utils/load-fixture.js'

test('should plant an apple sapling in an empty forest plot', async ({
  page,
}) => {
  await loadFixture(page, 'forest-tree-grown')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Forest' }).click()

  // forest[0] is [<grown apple tree>, null, null, null], so the second
  // .ForestPlot in DOM order (row-major) is the first empty plot.
  const targetPlot = page.locator('.ForestPlot').nth(1)
  await expect(targetPlot).toHaveClass(/is-empty/)

  await page.getByRole('button', { name: 'Apple Sapling' }).click()
  await targetPlot.click()

  await expect(targetPlot).not.toHaveClass(/is-empty/)
  await expect(targetPlot.locator('.ForestTreeSprite')).toHaveCount(1)

  // The sapling was the player's only one, so it's gone from inventory and
  // the toolbelt no longer offers it.
  await expect(
    page.getByRole('button', { name: 'Apple Sapling' })
  ).not.toBeVisible()
})

test('should harvest ripe fruit from a grown apple tree', async ({ page }) => {
  await loadFixture(page, 'forest-tree-grown')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Forest' }).click()

  const treePlot = page.locator('.ForestPlot').first()
  await expect(treePlot).toHaveClass(/can-be-harvested/)

  await treePlot.click()

  await expect(treePlot).not.toHaveClass(/can-be-harvested/)
  await expect(
    page.locator('.ContextPane').getByText('Apple', { exact: true })
  ).toBeVisible()
})

test('should regrow fruit after harvesting and be harvestable again', async ({
  page,
}) => {
  await loadFixture(page, 'forest-tree-grown')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Forest' }).click()

  const treePlot = page.locator('.ForestPlot').first()

  await expect(treePlot).toHaveClass(/can-be-harvested/)
  await treePlot.click()
  await expect(treePlot).not.toHaveClass(/can-be-harvested/)

  // apple's fruitTimeline (src/data/trees/apple.ts) sums to 6 days before
  // the fruit is grown back and pickable again.
  for (let day = 0; day < 6; day++) {
    await page.getByRole('button', { name: 'End the day to save your' }).click()
  }

  await expect(treePlot).toHaveClass(/can-be-harvested/)
  await treePlot.click()
  await expect(treePlot).not.toHaveClass(/can-be-harvested/)

  // Confirms two separate Apples were collected (one per harvest), not just
  // that the plot toggled through can-be-harvested twice: the sell view's
  // quantity input shows "<sell quantity> / <owned quantity>".
  const appleCard = page
    .locator('.ContextPane .Item')
    .filter({ has: page.getByText('Apple', { exact: true }) })

  await expect(appleCard).toContainText('/2')
})
