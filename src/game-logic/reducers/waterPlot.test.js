import { testCrop } from '../../test-utils'
import { getPlotContentFromItemId } from '../../utils'

import { waterPlot } from './waterPlot'

vitest.mock('../../data/maps')

describe('waterPlot', () => {
  describe('non-crop plotContent', () => {
    test('no-ops', () => {
      const inputState = { field: [[getPlotContentFromItemId('sprinkler')]] }
      const state = waterPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('crops', () => {
    test('sets wasWateredToday to true', () => {
      const { field } = waterPlot(
        {
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
        },
        0,
        0
      )

      expect(field[0][0].wasWateredToday).toBe(true)
    })
  })
})
