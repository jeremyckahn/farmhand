import { findInField, isRandomNumberLessThan } from '../../utils'
import { MAX_CROWS, SCARECROW_ITEM_ID } from '../../constants'

import { applyCrows, forEachPlot } from './applyCrows'

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  isRandomNumberLessThan: jest.fn(),
}))

const CARROT = 'carrot'

describe('applyCrows', () => {
  let state

  const addToField = itemId => state.field[0].push({ itemId })
  const findCarrot = plot => plot?.itemId === CARROT

  beforeEach(() => {
    state = {
      field: [[]],
      purchasedField: 0,
      newDayNotifications: [],
    }

    addToField(CARROT)

    jest.spyOn(Math, 'random')
  })

  describe('no crows spawned', () => {
    it('does not affect plots if a scarecrow is present', () => {
      addToField(SCARECROW_ITEM_ID)

      const newState = applyCrows(state)

      expect(newState.field).toEqual(state.field)
    })

    it('does not modify plots if rng fails', () => {
      isRandomNumberLessThan.mockReturnValue(true)
      const newState = applyCrows(state)

      expect(newState.field).toEqual(state.field)
    })

    it('does not create a notification if crops are not destroyed', () => {
      addToField(SCARECROW_ITEM_ID)
      const newState = applyCrows(state)

      expect(newState.newDayNotifications).toHaveLength(0)
    })
  })

  describe('crows spawned', () => {
    beforeEach(() => {
      isRandomNumberLessThan.mockReturnValue(false)
      Math.random.mockReturnValueOnce(1) // spawn max amount of crows
    })

    it('destroys a crop for every crow spawned', () => {
      const newState = applyCrows(state)

      expect(findInField(newState.field, findCarrot)).toEqual(null)
    })

    it('will not destroy more crops than the max number of crows', () => {
      for (let i = 0; i < MAX_CROWS; i++) {
        addToField(CARROT)
      }

      const newState = applyCrows(state)

      let numCarrotsRemaining = 0

      forEachPlot(newState, plotContents => {
        if (plotContents?.itemId === CARROT) {
          numCarrotsRemaining += 1
        }
      })

      expect(numCarrotsRemaining).toEqual(1)
    })

    it('creates a notification when crops are destroyed', () => {
      const newState = applyCrows(state)

      expect(newState.newDayNotifications[0]).toEqual({
        message: 'Oh no! Crows destroyed 1 crop!',
        severity: 'error',
      })
    })
  })
})
