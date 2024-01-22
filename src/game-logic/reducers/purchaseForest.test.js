import { EXPERIENCE_VALUES, PURCHASABLE_FOREST_SIZES } from '../../constants'
import { FOREST_AVAILABLE_NOTIFICATION } from '../../strings'

import { purchaseForest } from './purchaseForest'

const tree = () => {
  return {
    daysOld: 0,
    itemId: 'test-tree',
  }
}

describe('purchaseForest', () => {
  test('updates purchasedForest', () => {
    const { purchasedForest } = purchaseForest({ purchasedForest: 0 }, 0)
    expect(purchasedForest).toEqual(0)
  })

  test('prevents repurchasing options', () => {
    const { purchasedForest } = purchaseForest({ purchasedForest: 2 }, 1)
    expect(purchasedForest).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseForest(
      { todaysNotifications: [], money: 101_000, forest: [[]] },
      1
    )
    expect(money).toEqual(1_000)
  })

  test('adds experience', () => {
    const { experience } = purchaseForest(
      { experience: 0, todaysNotifications: [], forest: [[]] },
      1
    )

    expect(experience).toEqual(EXPERIENCE_VALUES.FOREST_EXPANDED)
  })

  test('shows notification', () => {
    const { todaysNotifications } = purchaseForest(
      { todaysNotifications: [], forest: [[]] },
      1
    )

    expect(todaysNotifications[0].message).toEqual(
      FOREST_AVAILABLE_NOTIFICATION
    )
  })

  describe('forest expansion', () => {
    test('forest expands without destroying existing data', () => {
      const expectedForest = []
      const forestSize = PURCHASABLE_FOREST_SIZES.get(1)

      for (let y = 0; y < forestSize.rows; y++) {
        const row = []
        for (let x = 0; x < forestSize.columns; x++) {
          row.push(null)
        }
        expectedForest.push(row)
      }

      const { forest } = purchaseForest(
        {
          todaysNotifications: [],
          forest: [
            [tree(), null],
            [null, tree()],
          ],
        },
        1
      )

      expectedForest[0][0] = tree()
      expectedForest[1][1] = tree()

      expect(forest).toEqual(expectedForest)
    })
  })
})
