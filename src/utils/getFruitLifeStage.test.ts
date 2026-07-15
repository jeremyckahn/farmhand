import { cropLifeStage } from '../enums.js'

import { getFruitLifeStage } from './getFruitLifeStage.js'

const { SEED, GROWING, GROWN } = cropLifeStage

describe('getFruitLifeStage', () => {
  test('maps a life cycle label to an image name chunk', () => {
    // apple's fruitTimeline is [2, 2, 2]. daysOld is 25, i.e. exactly
    // GROWN (see getTreeLifeStage.test.ts) - fruit is only ever relevant
    // while the tree itself is GROWN.
    const itemId = 'apple'
    const daysOld = 25

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

  test('is always SEED (no fruit) for a dead tree, regardless of daysSinceLastHarvest', () => {
    // apple's treeTimeline sums to 25 and its lifespan is 200
    // (src/data/trees/apple.ts) - DEAD from daysOld 225 on (see
    // getTreeLifeStage.test.ts).
    const itemId = 'apple'
    const daysOld = 225

    // daysSinceLastHarvest: 6 would normally be GROWN (ripe) fruit per the
    // test above - confirms a dead tree's fruit reads as SEED even when
    // daysSinceLastHarvest is frozen at what would otherwise be a ripe
    // value.
    expect(
      getFruitLifeStage({ itemId, daysOld, daysSinceLastHarvest: 6 })
    ).toBe(SEED)
  })
})
