import { treeLifeStage } from '../enums.js'

import { getTreeLifeStage } from './getTreeLifeStage.js'

const { SEED, GROWING, GROWN, DEAD } = treeLifeStage

describe('getTreeLifeStage', () => {
  test('maps a life cycle label to an image name chunk', () => {
    const itemId = 'apple'
    const daysSinceLastHarvest = 0

    expect(getTreeLifeStage({ itemId, daysOld: 0, daysSinceLastHarvest })).toBe(
      SEED
    )
    expect(getTreeLifeStage({ itemId, daysOld: 7, daysSinceLastHarvest })).toBe(
      GROWING
    )
    expect(
      getTreeLifeStage({ itemId, daysOld: 25, daysSinceLastHarvest })
    ).toBe(GROWN)
  })

  // apple's treeTimeline (src/data/trees/apple.ts) is [5, 5, 5, 5, 5]
  // (GROWN from daysOld 25) with a separate lifespan of 200, so it becomes
  // DEAD once daysOld reaches 25 + 200 = 225.
  describe('a tree that has been GROWN long enough to die', () => {
    test('is still GROWN right up until the full timeline sum', () => {
      const itemId = 'apple'
      const daysSinceLastHarvest = 0

      expect(
        getTreeLifeStage({ itemId, daysOld: 224, daysSinceLastHarvest })
      ).toBe(GROWN)
    })

    test('becomes DEAD once daysOld reaches the full timeline sum', () => {
      const itemId = 'apple'
      const daysSinceLastHarvest = 0

      expect(
        getTreeLifeStage({ itemId, daysOld: 225, daysSinceLastHarvest })
      ).toBe(DEAD)
      expect(
        getTreeLifeStage({ itemId, daysOld: 1000, daysSinceLastHarvest })
      ).toBe(DEAD)
    })
  })
})
