import { testState } from '../../test-utils/index.js'

import { processForest } from './processForest.js'

describe('processForest', () => {
  test('increments daysOld and does not advance the fruit cycle while the tree is not yet grown', () => {
    const { forest } = processForest(
      testState({
        // apple's treeTimeline is [5, 5, 5, 5, 5]; daysOld 2 -> 3 is still
        // within the seed stage (first 5 days), nowhere near GROWN.
        forest: [[{ itemId: 'apple', daysOld: 2, daysSinceLastHarvest: 0 }]],
      })
    )

    expect(forest[0][0]).toEqual({
      itemId: 'apple',
      daysOld: 3,
      daysSinceLastHarvest: 0,
    })
  })

  test('advances the fruit cycle once the tree is grown', () => {
    const { forest } = processForest(
      testState({
        // apple's treeTimeline sums to 25 days; daysOld 30 is well past
        // GROWN, so the fruit cycle should tick forward too.
        forest: [[{ itemId: 'apple', daysOld: 30, daysSinceLastHarvest: 1 }]],
      })
    )

    expect(forest[0][0]).toEqual({
      itemId: 'apple',
      daysOld: 31,
      daysSinceLastHarvest: 2,
    })
  })

  test('leaves empty plots as null', () => {
    const { forest } = processForest(
      testState({
        forest: [[null]],
      })
    )

    expect(forest[0][0]).toEqual(null)
  })
})
