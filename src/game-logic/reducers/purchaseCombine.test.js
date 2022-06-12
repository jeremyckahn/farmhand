import { PURCHASEABLE_COMBINES } from '../../constants'

import { purchaseCombine } from './purchaseCombine'

describe('purchaseCombine', () => {
  test('updates purchasedCombine', () => {
    const { purchasedCombine } = purchaseCombine({}, 1)
    expect(purchasedCombine).toEqual(1)
  })

  test('prevents repurchasing options', () => {
    const { purchasedCombine } = purchaseCombine({ purchasedCombine: 2 }, 1)
    expect(purchasedCombine).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseCombine({ money: 500000 }, 1)
    expect(money).toEqual(PURCHASEABLE_COMBINES.get(1).price - 500000)
  })
})
