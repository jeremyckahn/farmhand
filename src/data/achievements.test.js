import { testCrop } from '../test-utils'
import * as reducers from '../reducers'

import { achievementsMap } from './achievements'

jest.mock('./items')
jest.mock('./recipes')

describe('harvest-crop', () => {
  describe('condition', () => {
    let inputState

    beforeEach(() => {
      inputState = {
        field: [
          [null, null, testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })],
        ],
        inventory: [],
      }
    })

    describe('is not met', () => {
      test('returns false', () => {
        expect(
          achievementsMap['harvest-crop'].condition(inputState, inputState)
        ).toEqual(false)
      })
    })

    describe('is met', () => {
      test('returns true', () => {
        expect(
          achievementsMap['harvest-crop'].condition(
            reducers.harvestPlot(inputState, 2, 0),
            inputState
          )
        ).toEqual(true)
      })
    })
  })
})
