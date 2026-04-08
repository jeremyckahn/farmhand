import { EXPERIENCE_VALUES, PURCHASEABLE_COW_PENS } from '../../constants.js'
import { testState } from '../../test-utils/index.js'

import { purchaseCowPen } from './purchaseCowPen.js'

describe('purchaseCowPen', () => {
  test('updates purchasedCowPen', () => {
    const { purchasedCowPen } = purchaseCowPen(testState(), 1)
    expect(purchasedCowPen).toEqual(1)
  })

  test('prevents repurchasing options', () => {
    const { purchasedCowPen } = purchaseCowPen(
      testState({ purchasedCowPen: 2 }),
      1
    )
    expect(purchasedCowPen).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseCowPen(testState({ money: 1500 }), 1)
    expect(money).toEqual(1500 - (PURCHASEABLE_COW_PENS.get(1)?.price ?? 0))
  })

  test('shows notification of purchase', () => {
    const { todaysNotifications } = purchaseCowPen(testState(), 1)
    expect(todaysNotifications[0].message).toEqual(
      'Purchased a cow pen with capacity for 10 cows! You can visit your cow pen by going to the "Cows" page.'
    )
  })

  test('adds experience when cow pen is acquired', () => {
    const { experience } = purchaseCowPen(testState({ experience: 0 }), 1)

    expect(experience).toEqual(EXPERIENCE_VALUES.COW_PEN_ACQUIRED)
  })

  test('adds experience when cow pen is expanded', () => {
    const { experience } = purchaseCowPen(testState({ experience: 0 }), 2)

    expect(experience).toEqual(EXPERIENCE_VALUES.COW_PEN_EXPANDED)
  })
})
