import { PURCHASEABLE_COMBINES } from '../../constants.js'

import { purchaseCombine } from './purchaseCombine.js'

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
    const { money } = purchaseCombine(
      { money: (PURCHASEABLE_COMBINES.get(1)?.price ?? 0) + 10 },
      1
    )
    expect(money).toEqual(10)
  })
})
