import { testCrop } from '../../test-utils/testCrop.js'
import { testState } from '../../test-utils/testState.js'
import { getPlotContentFromItemId } from '../../utils/getPlotContentFromItemId.js'

import { waterPlot } from './waterPlot.js'

vitest.mock('../../data/maps.js')

describe('waterPlot', () => {
  describe('non-crop plotContent', () => {
    test('no-ops', () => {
      const inputState = testState({
        field: [[getPlotContentFromItemId('sprinkler')]],
      })
      const state = waterPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('crops', () => {
    test('sets wasWateredToday to true', () => {
      const { field } = waterPlot(
        testState({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
        }),
        0,
        0
      )

      expect(field[0][0]?.wasWateredToday).toBe(true)
    })
  })
})
