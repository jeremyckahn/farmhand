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

  describe('a tree instance with its own randomized lifespan', () => {
    test('uses tree.lifespan instead of the species default', () => {
      const itemId = 'apple'
      const daysSinceLastHarvest = 0
      const daysOld = 210 // Past a shortened lifespan, not the 225 default.

      expect(
        getTreeLifeStage({
          itemId,
          daysOld,
          daysSinceLastHarvest,
          // 25 (growth) + 185 (this tree's own, shorter lifespan) = 210.
          lifespan: 185,
        })
      ).toBe(DEAD)

      // Same daysOld, but no override - falls back to the 225-day default,
      // so it's still GROWN.
      expect(getTreeLifeStage({ itemId, daysOld, daysSinceLastHarvest })).toBe(
        GROWN
      )
    })
  })

  describe('a tree with an accelerated (fertilized) daysGrown counter', () => {
    test('classifies by daysGrown instead of daysOld when present', () => {
      const itemId = 'apple'
      const daysSinceLastHarvest = 0

      // daysOld alone (7) would be GROWING, but a fertilized daysGrown of
      // 25 has already reached GROWN.
      expect(
        getTreeLifeStage({
          itemId,
          daysOld: 7,
          daysGrown: 25,
          daysSinceLastHarvest,
        })
      ).toBe(GROWN)
    })

    test('does not affect death timing, which stays keyed on raw daysOld', () => {
      const itemId = 'apple'
      const daysSinceLastHarvest = 0

      // daysGrown alone (well past 25) doesn't matter for DEAD - only raw
      // daysOld (200, short of the 225 default) does, so this is GROWN.
      expect(
        getTreeLifeStage({
          itemId,
          daysOld: 200,
          daysGrown: 1000,
          daysSinceLastHarvest,
        })
      ).toBe(GROWN)
    })
  })
})
