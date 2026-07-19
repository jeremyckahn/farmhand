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

test('should chop down a tree for wood, harvesting any ripe fruit as a bonus', async ({
  page,
}) => {
  await loadFixture(page, 'forest-tree-grown')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Forest' }).click()

  const treePlot = page.locator('.ForestPlot').first()
  await expect(treePlot).toHaveClass(/can-be-harvested/)

  await page.getByRole('button', { name: /Select the axe/ }).click()
  await treePlot.click()

  // The tree is gone entirely, not just its fruit.
  await expect(treePlot).toHaveClass(/is-empty/)
  await expect(treePlot.locator('.ForestTreeSprite')).toHaveCount(0)

  // The bonus fruit and the wood both landed in inventory.
  await expect(
    page.locator('.ContextPane').getByText('Apple', { exact: true })
  ).toBeVisible()
  await expect(
    page.locator('.ContextPane').getByText('Wood', { exact: true })
  ).toBeVisible()
})

test('should not treat a dead tree as harvestable, even with frozen ripe-looking fruit', async ({
  page,
}) => {
  // forest-tree-dead's tree is past apple's full treeTimeline sum (225
  // days) and was frozen with a daysSinceLastHarvest that would read as
  // ripe on a living tree.
  await loadFixture(page, 'forest-tree-dead')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Forest' }).click()

  const treePlot = page.locator('.ForestPlot').first()
  await expect(treePlot).not.toHaveClass(/can-be-harvested/)

  await treePlot.click()

  // No fruit was picked - the tree, and its frozen fruit, are unaffected.
  await expect(treePlot).not.toHaveClass(/is-empty/)
  await expect(
    page.locator('.ContextPane').getByText('Apple', { exact: true })
  ).not.toBeVisible()
})

test('should chop down a dead tree for the full wood yield, with no fruit bonus', async ({
  page,
}) => {
  await loadFixture(page, 'forest-tree-dead')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Forest' }).click()

  const treePlot = page.locator('.ForestPlot').first()

  await page.getByRole('button', { name: /Select the axe/ }).click()
  await treePlot.click()

  // The dead tree is gone entirely, same as a chopped living one.
  await expect(treePlot).toHaveClass(/is-empty/)
  await expect(treePlot.locator('.ForestTreeSprite')).toHaveCount(0)

  // Wood was collected, but the frozen ripe-looking fruit was not - a dead
  // tree's fruit never grows, so there's nothing left to bonus-harvest.
  await expect(
    page.locator('.ContextPane').getByText('Wood', { exact: true })
  ).toBeVisible()
  await expect(
    page.locator('.ContextPane').getByText('Apple', { exact: true })
  ).not.toBeVisible()
})

test('should apply mulch to a tree and consume it from inventory', async ({
  page,
}) => {
  await loadFixture(page, 'forest-tree-mulch')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Forest' }).click()

  const treePlot = page.locator('.ForestPlot').first()

  await page.getByRole('button', { name: 'Mulch' }).click()
  await treePlot.click()

  // The mulch was the player's only one, so it's gone from inventory
  // and the toolbelt no longer offers it.
  await expect(page.getByRole('button', { name: 'Mulch' })).not.toBeVisible()

  // A second click on the same (already-mulched) plot while mulch mode was
  // still active - now a no-op since there's none left to select -
  // shouldn't do anything odd like harvesting or chopping.
  await treePlot.click()
  await expect(treePlot).not.toHaveClass(/is-empty/)
})

test('should grow a rainbow-mulched tree faster than a mulched tree, and a mulched tree faster than an unmulched one', async ({
  page,
}) => {
  await loadFixture(page, 'forest-tree-mulch-comparison')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Forest' }).click()

  // forest[0] is three same-age apple trees followed by an empty plot, so
  // the first three .ForestPlot elements in DOM order are the trees under
  // test.
  const mulchedPlot = page.locator('.ForestPlot').nth(0)
  const rainbowMulchedPlot = page.locator('.ForestPlot').nth(1)
  const unmulchedPlot = page.locator('.ForestPlot').nth(2)

  // Each button's accessible name is "<item name> <quantity>" (see
  // ItemList.tsx), and "Mulch" is otherwise a substring match of "Rainbow
  // Mulch 1" - both buttons are in the toolbelt at once here, so the plain
  // mulch button needs an anchored regex to avoid matching both.
  const mulchButton = page.getByRole('button', { name: /^Mulch\s/ })
  const rainbowMulchButton = page.getByRole('button', {
    name: 'Rainbow Mulch',
  })

  await mulchButton.click()
  await mulchedPlot.click()

  await rainbowMulchButton.click()
  await rainbowMulchedPlot.click()

  // Both mulches were the player's only ones, so they're gone from
  // inventory and the toolbelt no longer offers either.
  await expect(mulchButton).not.toBeVisible()
  await expect(rainbowMulchButton).not.toBeVisible()

  const endDay = () =>
    page.getByRole('button', { name: 'End the day to save your' }).click()

  // All three trees start this test 5 daysGrown short of apple's 25-day
  // growth timeline (treeTimeline in src/data/trees/apple.ts), and fruit
  // hasn't started growing on any of them yet.
  await expect(mulchedPlot).not.toHaveClass(/can-be-harvested/)
  await expect(rainbowMulchedPlot).not.toHaveClass(/can-be-harvested/)
  await expect(unmulchedPlot).not.toHaveClass(/can-be-harvested/)

  // Mulch and Rainbow Mulch both speed up the initial growth phase
  // equally (FERTILIZER_BONUS applies to daysGrown regardless of tier),
  // finishing it on day 4 while the unmulched tree needs a 5th day.
  // Fruit (fruitTimeline sums to 6 days, src/data/trees/apple.ts) only
  // starts growing once a tree reaches its permanent grown state, and
  // only Rainbow Mulch accelerates fruit regrowth - so by day 6 none of
  // the three have ripe fruit yet.
  for (let day = 0; day < 6; day++) {
    await endDay()
  }

  await expect(mulchedPlot).not.toHaveClass(/can-be-harvested/)
  await expect(rainbowMulchedPlot).not.toHaveClass(/can-be-harvested/)
  await expect(unmulchedPlot).not.toHaveClass(/can-be-harvested/)

  // Day 7: the rainbow-mulched tree's accelerated fruit regrowth crosses
  // the 6-day fruit timeline first - it's the only one with ripe fruit.
  await endDay()

  await expect(mulchedPlot).not.toHaveClass(/can-be-harvested/)
  await expect(rainbowMulchedPlot).toHaveClass(/can-be-harvested/)
  await expect(unmulchedPlot).not.toHaveClass(/can-be-harvested/)

  // Day 9: the mulched (non-rainbow) tree catches up next - it regrows
  // fruit at the normal rate, but got a one-day head start finishing its
  // growth phase. The unmulched tree, which finished its growth phase a
  // day later than the mulched trees and also regrows fruit at the
  // normal rate, is still lagging.
  await endDay()
  await endDay()

  await expect(mulchedPlot).toHaveClass(/can-be-harvested/)
  await expect(rainbowMulchedPlot).toHaveClass(/can-be-harvested/)
  await expect(unmulchedPlot).not.toHaveClass(/can-be-harvested/)

  // Day 10: the unmulched tree finally catches up too.
  await endDay()

  await expect(mulchedPlot).toHaveClass(/can-be-harvested/)
  await expect(rainbowMulchedPlot).toHaveClass(/can-be-harvested/)
  await expect(unmulchedPlot).toHaveClass(/can-be-harvested/)
})

test('should purchase a Wood Chipper and craft the Wood Chips -> Mulch recipe chain', async ({
  page,
}) => {
  await loadFixture(page, 'forest-wood-chipper')

  // Buy the Wood Chipper from the Shop's Upgrades tab.
  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()
  await page.getByRole('tab', { name: 'Upgrades' }).click()

  const woodChipperCard = page
    .locator('.TierPurchase')
    .filter({ hasText: 'Buy wood chipper' })
  await woodChipperCard.getByRole('button', { name: 'Buy' }).click()

  await expect(
    woodChipperCard.getByText("You've already purchased the wood chipper!")
  ).toBeVisible()

  // Craft Wood Chips from Wood, then Mulch from Wood Chips + Compost, in
  // the newly-unlocked Wood Chipper Workshop tab.
  await page.getByText(': Shop').click()
  await page.getByRole('option', { name: ': Workshop' }).click()
  await page.getByRole('tab', { name: 'Wood Chipper' }).click()

  // Ingredient lists inside other recipe cards (e.g. Mulch lists "Wood
  // Chips" as an ingredient) also contain this text, so scope to the
  // card's own title rather than any text in the card.
  const woodChipsCard = page.locator('.Recipe').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Wood Chips$/ }),
  })

  // Mulch needs 3 Wood Chips - craft more than the default quantity of 1.
  await woodChipsCard.locator('input').dblclick()
  await woodChipsCard.locator('input').fill('3')
  await woodChipsCard.getByRole('button', { name: 'Make' }).click()

  await expect(
    page.locator('.ContextPane').getByText('Wood Chips', { exact: true })
  ).toBeVisible()

  const mulchCard = page.locator('.Recipe').filter({
    has: page.locator('.MuiCardHeader-title', { hasText: /^Mulch$/ }),
  })
  await mulchCard.getByRole('button', { name: 'Make' }).click()

  await expect(
    page.locator('.ContextPane').getByText('Mulch', { exact: true })
  ).toBeVisible()
})

test("should be able to buy Mulch directly from the Shop's Supplies tab", async ({
  page,
}) => {
  await loadFixture(page, 'forest-wood-chipper')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Shop' }).click()
  await page.getByRole('tab', { name: 'Supplies' }).click()

  const mulchCard = page.locator('.Item').filter({ hasText: 'Mulch' })
  await mulchCard.getByPlaceholder('0').dblclick()
  await mulchCard.getByPlaceholder('0').fill('1')
  await mulchCard.getByRole('button', { name: 'Buy' }).click()

  await expect(
    page.locator('.ContextPane').getByText('Mulch', { exact: true })
  ).toBeVisible()
})
