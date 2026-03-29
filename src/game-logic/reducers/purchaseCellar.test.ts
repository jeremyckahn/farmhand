import { EXPERIENCE_VALUES, PURCHASEABLE_CELLARS } from '../../constants.js'
import { testState } from '../../test-utils/index.js'

import { purchaseCellar } from './purchaseCellar.js'

describe('purchaseCellar', () => {
  test('updates purchasedCellar', () => {
    const { purchasedCellar } = purchaseCellar(testState(), 1)
    expect(purchasedCellar).toEqual(1)
  })

  test('prevents repurchasing options', () => {
    const { purchasedCellar } = purchaseCellar(
      testState({ purchasedCellar: 2 }),
      1
    )
    expect(purchasedCellar).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseCellar(testState({ money: 1_000_000 }), 1)
    // @ts-expect-error
    expect(money).toEqual(1_000_000 - PURCHASEABLE_CELLARS.get(1).price)
  })

  test('shows notification of purchase', () => {
    const { todaysNotifications } = purchaseCellar(testState(), 1)
    expect(todaysNotifications[0].message).toEqual(
      'Purchased a cellar with capacity for 10 kegs! View your keg inventory by going to the "Cellar" page.'
    )
  })

  test('adds experience when acquired', () => {
    const { experience } = purchaseCellar(testState({ experience: 0 }), 1)

    expect(experience).toEqual(EXPERIENCE_VALUES.CELLAR_ACQUIRED)
  })

  test('adds experience when expanded', () => {
    const { experience } = purchaseCellar(testState({ experience: 0 }), 2)

    expect(experience).toEqual(EXPERIENCE_VALUES.CELLAR_EXPANDED)
  })
})
