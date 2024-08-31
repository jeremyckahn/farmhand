import { EXPERIENCE_VALUES, PURCHASEABLE_COMPOSTERS } from '../../constants.js'
import { RECYCLING_AVAILABLE_NOTIFICATION } from '../../strings.js'

import { purchaseComposter } from './purchaseComposter.js'

describe('purchaseComposter', () => {
  let gameState, newState

  beforeEach(() => {
    gameState = {
      experience: 0,
      money: PURCHASEABLE_COMPOSTERS.get(1).price,
      purchasedComposter: 0,
      todaysNotifications: [],
      itemsSold: [],
    }
  })

  describe('successful purchase', () => {
    beforeEach(() => {
      newState = purchaseComposter(gameState, 1)
    })

    test('it sets the purchased composter', () => {
      expect(newState.purchasedComposter).toEqual(1)
    })

    test('it deducts the composter cost', () => {
      expect(newState.money).toEqual(0)
    })

    test('it adds experience', () => {
      expect(newState.experience).toEqual(EXPERIENCE_VALUES.COMPOSTER_ACQUIRED)
    })

    test('it shows the recycling available notification', () => {
      expect(newState.todaysNotifications[0].message).toEqual(
        RECYCLING_AVAILABLE_NOTIFICATION
      )
    })
  })

  describe('unsuccessful purchase', () => {
    beforeEach(() => {
      gameState.purchasedComposter = 1

      newState = purchaseComposter(gameState, 1)
    })

    test('it did not alter the game state', () => {
      expect(newState).toEqual(gameState)
    })
  })
})
