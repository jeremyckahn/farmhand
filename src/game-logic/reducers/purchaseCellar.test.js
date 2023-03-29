import { PURCHASEABLE_CELLARS } from '../../constants'

import { purchaseCellar } from './purchaseCellar'

describe('purchaseCellar', () => {
  test('updates purchasedCellar', () => {
    const { purchasedCellar } = purchaseCellar({}, 1)
    expect(purchasedCellar).toEqual(1)
  })

  test('prevents repurchasing options', () => {
    const { purchasedCellar } = purchaseCellar({ purchasedCellar: 2 }, 1)
    expect(purchasedCellar).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseCellar({ money: 1_000_000 }, 1)
    expect(money).toEqual(1_000_000 - PURCHASEABLE_CELLARS.get(1).price)
  })
})
