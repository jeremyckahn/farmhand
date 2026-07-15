import { getTreeGrowingPhase } from './getTreeGrowingPhase.js'

describe('getTreeGrowingPhase', () => {
  test('derives the growing phase from daysOld when daysGrown is absent', () => {
    // apple's treeTimeline is [5, 5, 5, 5, 5] - daysOld 7 is in the second
    // growing phase.
    expect(
      getTreeGrowingPhase({
        itemId: 'apple',
        daysOld: 7,
        daysSinceLastHarvest: 0,
      })
    ).toBe(1)
  })

  test('uses daysGrown instead of daysOld when present', () => {
    // daysOld alone (7) would be phase 1, but a fertilized daysGrown of 12
    // has already progressed further.
    expect(
      getTreeGrowingPhase({
        itemId: 'apple',
        daysOld: 7,
        daysGrown: 12,
        daysSinceLastHarvest: 0,
      })
    ).toBe(2)
  })
})
