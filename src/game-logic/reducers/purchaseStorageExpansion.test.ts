import { STORAGE_EXPANSION_AMOUNT } from '../../constants.ts'
import { getCostOfNextStorageExpansion } from '../../utils/index.tsx'
import { testState } from '../../test-utils/index.ts'

import { purchaseStorageExpansion } from './purchaseStorageExpansion.ts'

describe('purchaseStorageExpansion', () => {
  describe('player does not have enough money', () => {
    test('no-ops', () => {
      const inputState = testState({
        money: getCostOfNextStorageExpansion(100) - 1,
        inventoryLimit: 100,
      })

      const state = purchaseStorageExpansion(inputState)
      expect(state).toEqual(inputState)
    })
  })

  describe('player has enough money', () => {
    test('increase storage is purchased', () => {
      const { inventoryLimit, money } = purchaseStorageExpansion(
        testState({
          inventoryLimit: 100,
          money: getCostOfNextStorageExpansion(100),
        })
      )

      expect(inventoryLimit).toEqual(100 + STORAGE_EXPANSION_AMOUNT)
      expect(money).toEqual(0)
    })
  })
})
