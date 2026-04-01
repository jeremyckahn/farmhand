import { testCrop, testState } from '../../test-utils/index.ts'

import { waterPlot } from './waterPlot.ts'
import { forRange } from './forRange.ts'

vitest.mock('../../data/maps.ts')

describe('forRange', () => {
  test('calls given reducer on range of plots', () => {
    const { field } = forRange(
      testState({
        field: [
          [
            testCrop({ itemId: 'sample-crop-1' }),
            testCrop({ itemId: 'sample-crop-1' }),
          ],
          [testCrop({ itemId: 'sample-crop-1' })],
          [],
          [],
          [testCrop({ itemId: 'sample-crop-1' })],
        ],
      }),
      waterPlot,
      1,
      1,
      1
    )

    expect(field[0][0]?.wasWateredToday).toBe(true)
    expect(field[0][1]?.wasWateredToday).toBe(true)
    expect(field[1][0]?.wasWateredToday).toBe(true)
    expect(field[4][0]?.wasWateredToday).toBe(false)
  })
})
