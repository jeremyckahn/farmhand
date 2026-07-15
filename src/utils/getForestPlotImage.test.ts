import { items as itemImages } from '../img/index.js'

import { getForestPlotImage } from './getForestPlotImage.js'

describe('getForestPlotImage', () => {
  test('returns null for an empty plot', () => {
    expect(getForestPlotImage(null)).toBe(null)
  })

  test('returns plot images for a planted tree', () => {
    const itemId = 'apple'
    const daysSinceLastHarvest = 0

    expect(
      getForestPlotImage({ itemId, daysOld: 0, daysSinceLastHarvest })
    ).toBe(itemImages['apple-tree-sapling-planted'])
    expect(
      getForestPlotImage({ itemId, daysOld: 7, daysSinceLastHarvest })
    ).toBe(itemImages['apple-tree-growing-1'])
    expect(
      getForestPlotImage({ itemId, daysOld: 12, daysSinceLastHarvest })
    ).toBe(itemImages['apple-tree-growing-2'])
    expect(
      getForestPlotImage({ itemId, daysOld: 25, daysSinceLastHarvest })
    ).toBe(itemImages['apple-tree-grown'])
  })

  test('resolves the dead-tree art key once a tree has died', () => {
    const itemId = 'apple'
    const daysSinceLastHarvest = 0

    // apple's full treeTimeline sum (src/data/trees/apple.ts) is 225 - DEAD
    // from that point on (see getTreeLifeStage.test.ts).
    expect(
      getForestPlotImage({ itemId, daysOld: 225, daysSinceLastHarvest })
    ).toBe(itemImages['apple-tree-dead'])
  })
})
