import { cropLifeStage } from '../enums.js'

import { getFruitLifeStage } from './getFruitLifeStage.js'

const { SEED, GROWING, GROWN } = cropLifeStage

describe('getFruitLifeStage', () => {
  test('maps a life cycle label to an image name chunk', () => {
    // apple's fruitTimeline is [2, 2, 2]
    const itemId = 'apple'
    const daysOld = 25 // irrelevant to this util; tree-gating happens elsewhere

    expect(
      getFruitLifeStage({ itemId, daysOld, daysSinceLastHarvest: 0 })
    ).toBe(SEED)
    expect(
      getFruitLifeStage({ itemId, daysOld, daysSinceLastHarvest: 3 })
    ).toBe(GROWING)
    expect(
      getFruitLifeStage({ itemId, daysOld, daysSinceLastHarvest: 6 })
    ).toBe(GROWN)
  })
})
