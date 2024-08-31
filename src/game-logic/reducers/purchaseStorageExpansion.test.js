import { STORAGE_EXPANSION_AMOUNT } from '../../constants.js'
import { getCostOfNextStorageExpansion } from '../../utils/index.js'

import { purchaseStorageExpansion } from './purchaseStorageExpansion.js'

describe('purchaseStorageExpansion', () => {
  describe('player does not have enough money', () => {
    test('no-ops', () => {
      const inputState = {
        money: getCostOfNextStorageExpansion(100) - 1,
        inventoryLimit: 100,
      }

      const state = purchaseStorageExpansion(inputState)
      expect(state).toEqual(inputState)
    })
  })

  describe('player has enough money', () => {
    test('increase storage is purchased', () => {
      const { inventoryLimit, money } = purchaseStorageExpansion({
        inventoryLimit: 100,
        money: getCostOfNextStorageExpansion(100),
      })

      expect(inventoryLimit).toEqual(100 + STORAGE_EXPANSION_AMOUNT)
      expect(money).toEqual(0)
    })
  })
})
