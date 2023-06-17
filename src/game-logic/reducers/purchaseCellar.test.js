import { PURCHASEABLE_CELLARS } from '../../constants'

import { purchaseCellar } from './purchaseCellar'

describe('purchaseCellar', () => {
  test('updates purchasedCellar', () => {
    const { purchasedCellar } = purchaseCellar({ todaysNotifications: [] }, 1)
    expect(purchasedCellar).toEqual(1)
  })

  test('prevents repurchasing options', () => {
    const { purchasedCellar } = purchaseCellar(
      { todaysNotifications: [], purchasedCellar: 2 },
      1
    )
    expect(purchasedCellar).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseCellar(
      { todaysNotifications: [], money: 1_000_000 },
      1
    )
    expect(money).toEqual(1_000_000 - PURCHASEABLE_CELLARS.get(1).price)
  })

  test('shows notification of purchase', () => {
    const { todaysNotifications } = purchaseCellar(
      { todaysNotifications: [] },
      1
    )
    expect(todaysNotifications[0].message).toEqual(
      'Purchased a cellar with capacity for 10 kegs! View your keg inventory by going to the "Cellar" page.'
    )
  })
})
