import { testState } from '../../test-utils/index.js'
import { fertilizerType } from '../../enums.js'

import { processForest } from './processForest.js'

const { NONE, STANDARD, RAINBOW } = fertilizerType

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
      daysGrown: 3,
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
      daysGrown: 31,
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

  describe('mulch', () => {
    test('an unmulched tree advances daysGrown at the same rate as daysOld', () => {
      const { forest } = processForest(
        testState({
          forest: [
            [
              {
                itemId: 'apple',
                daysOld: 2,
                daysGrown: 2,
                daysSinceLastHarvest: 0,
                fertilizerType: NONE,
              },
            ],
          ],
        })
      )

      expect(forest[0][0]).toMatchObject({ daysOld: 3, daysGrown: 3 })
    })

    test('a standard-mulched tree advances daysGrown faster than daysOld, but not the fruit cycle', () => {
      const { forest } = processForest(
        testState({
          forest: [
            [
              {
                itemId: 'apple',
                // Past GROWN (25) so the fruit-cycle gate is open.
                daysOld: 30,
                daysGrown: 30,
                daysSinceLastHarvest: 1,
                fertilizerType: STANDARD,
              },
            ],
          ],
        })
      )

      expect(forest[0][0]).toMatchObject({
        daysOld: 31,
        daysGrown: 31.5,
        // No fruit bonus for standard mulch - only rainbow gets one.
        daysSinceLastHarvest: 2,
      })
    })

    test('a rainbow-mulched tree advances both daysGrown and the fruit cycle faster', () => {
      const { forest } = processForest(
        testState({
          forest: [
            [
              {
                itemId: 'apple',
                daysOld: 30,
                daysGrown: 30,
                daysSinceLastHarvest: 1,
                fertilizerType: RAINBOW,
              },
            ],
          ],
        })
      )

      expect(forest[0][0]).toMatchObject({
        daysOld: 31,
        daysGrown: 31.5,
        daysSinceLastHarvest: 2.5,
      })
    })
  })
})
