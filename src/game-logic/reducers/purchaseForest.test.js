import { EXPERIENCE_VALUES, PURCHASABLE_FOREST_SIZES } from '../../constants.js'
import { FOREST_AVAILABLE_NOTIFICATION } from '../../strings.js'
import { testState, testTree } from '../../test-utils/index.js'

import { purchaseForest } from './purchaseForest.js'

describe('purchaseForest', () => {
  test('updates purchasedForest', () => {
    const { purchasedForest } = purchaseForest(
      testState({ purchasedForest: 0 }),
      0
    )
    expect(purchasedForest).toEqual(0)
  })

  test('prevents repurchasing options', () => {
    const { purchasedForest } = purchaseForest(
      testState({ purchasedForest: 2 }),
      1
    )
    expect(purchasedForest).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseForest(
      testState({
        todaysNotifications: [],
        money: 101_000,
        forest: [[]],
      }),
      1
    )
    expect(money).toEqual(1_000)
  })

  test('adds experience', () => {
    const { experience } = purchaseForest(
      testState({
        experience: 0,
        todaysNotifications: [],
        forest: [[]],
      }),
      1
    )

    expect(experience).toEqual(EXPERIENCE_VALUES.FOREST_EXPANDED)
  })

  test('shows notification', () => {
    const { todaysNotifications } = purchaseForest(
      testState({
        todaysNotifications: [],
        forest: [[]],
      }),
      1
    )

    expect(todaysNotifications[0].message).toEqual(
      FOREST_AVAILABLE_NOTIFICATION
    )
  })

  describe('forest expansion', () => {
    test('forest expands without destroying existing data', () => {
      const expectedForest = /** @type {Array<Array<any>>} */ ([])
      const forestSize = PURCHASABLE_FOREST_SIZES.get(1)

      if (!forestSize) {
        throw new Error('Forest size not found')
      }

      for (let y = 0; y < forestSize.rows; y++) {
        const row = /** @type {Array<any>} */ ([])
        for (let x = 0; x < forestSize.columns; x++) {
          row.push(null)
        }
        expectedForest.push(row)
      }

      const { forest } = purchaseForest(
        testState({
          todaysNotifications: [],
          forest: [
            [testTree(), null],
            [null, testTree()],
          ],
        }),
        1
      )

      expectedForest[0][0] = testTree()
      expectedForest[1][1] = testTree()

      expect(forest).toEqual(expectedForest)
    })
  })
})
