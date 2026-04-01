import { PURCHASEABLE_COMBINES } from '../../constants.ts'
import { testState } from '../../test-utils/index.ts'

import { purchaseCombine } from './purchaseCombine.ts'

describe('purchaseCombine', () => {
  test('updates purchasedCombine', () => {
    const { purchasedCombine } = purchaseCombine(testState(), 1)
    expect(purchasedCombine).toEqual(1)
  })

  test('prevents repurchasing options', () => {
    const { purchasedCombine } = purchaseCombine(
      testState({ purchasedCombine: 2 }),
      1
    )
    expect(purchasedCombine).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseCombine(
      testState({ money: (PURCHASEABLE_COMBINES.get(1)?.price ?? 0) + 10 }),
      1
    )
    expect(money).toEqual(10)
  })
})
