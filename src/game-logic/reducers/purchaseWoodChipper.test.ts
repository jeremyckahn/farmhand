import {
  EXPERIENCE_VALUES,
  PURCHASEABLE_WOOD_CHIPPERS,
} from '../../constants.js'
import { WOOD_CHIPPER_AVAILABLE_NOTIFICATION } from '../../strings.js'

import { testState } from '../../test-utils/index.js'

import { purchaseWoodChipper } from './purchaseWoodChipper.js'

describe('purchaseWoodChipper', () => {
  let gameState: farmhand.state, newState: farmhand.state

  beforeEach(() => {
    gameState = testState({
      experience: 0,
      money: PURCHASEABLE_WOOD_CHIPPERS.get(1)?.price ?? 0,
      purchasedWoodChipper: 0,
      todaysNotifications: [],
      itemsSold: {},
    })
  })

  describe('successful purchase', () => {
    beforeEach(() => {
      newState = purchaseWoodChipper(gameState, 1)
    })

    test('it sets the purchased wood chipper', () => {
      expect(newState.purchasedWoodChipper).toEqual(1)
    })

    test('it deducts the wood chipper cost', () => {
      expect(newState.money).toEqual(0)
    })

    test('it adds experience', () => {
      expect(newState.experience).toEqual(
        EXPERIENCE_VALUES.WOOD_CHIPPER_ACQUIRED
      )
    })

    test('it shows the wood chipper available notification', () => {
      expect(newState.todaysNotifications[0].message).toEqual(
        WOOD_CHIPPER_AVAILABLE_NOTIFICATION
      )
    })
  })

  describe('unsuccessful purchase', () => {
    beforeEach(() => {
      gameState.purchasedWoodChipper = 1

      newState = purchaseWoodChipper(gameState, 1)
    })

    test('it did not alter the game state', () => {
      expect(newState).toEqual(gameState)
    })
  })
})
