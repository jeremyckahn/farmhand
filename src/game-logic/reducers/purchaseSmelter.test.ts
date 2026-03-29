import { EXPERIENCE_VALUES, PURCHASEABLE_SMELTERS } from '../../constants.js'
import { FORGE_AVAILABLE_NOTIFICATION } from '../../strings.js'

import { purchaseSmelter } from './purchaseSmelter.js'

describe('purchaseSmelter', () => {
  let gameState, newState

  beforeEach(() => {
    gameState = {
      experience: 0,
      money: PURCHASEABLE_SMELTERS.get(1)?.price ?? 0,
      purchasedSmelter: 0,
      todaysNotifications: [],
      itemsSold: [],
    }
  })

  describe('successful purchase', () => {
    beforeEach(() => {
      newState = purchaseSmelter(gameState, 1)
    })

    test('it sets the purchased smelter', () => {
      expect(newState.purchasedSmelter).toEqual(1)
    })

    test('it deducts the smelter cost', () => {
      expect(newState.money).toEqual(0)
    })

    test('it shows the forge available notification', () => {
      expect(newState.todaysNotifications[0].message).toEqual(
        FORGE_AVAILABLE_NOTIFICATION
      )
    })

    test('adds experience', () => {
      expect(newState.experience).toEqual(EXPERIENCE_VALUES.SMELTER_ACQUIRED)
    })
  })

  describe('unsuccessful purchase', () => {
    beforeEach(() => {
      gameState.purchasedSmelter = 1

      newState = purchaseSmelter(gameState, 1)
    })

    test('it did not alter the game state', () => {
      expect(newState).toEqual(gameState)
    })
  })
})
