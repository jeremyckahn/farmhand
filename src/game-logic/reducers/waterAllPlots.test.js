import { testCrop } from '../../test-utils/index.js'

import { waterAllPlots } from './waterAllPlots.js'

vitest.mock('../../data/maps.js')
vitest.mock('../../data/items.js')

describe('waterAllPlots', () => {
  test('sets wasWateredToday to true for all plots', () => {
    const { field } = waterAllPlots({
      field: [
        [
          testCrop({ itemId: 'sample-crop-1' }),
          testCrop({ itemId: 'sample-crop-2' }),
        ],
        [testCrop({ itemId: 'sample-crop-3' })],
      ],
    })

    expect(field[0][0].wasWateredToday).toBe(true)
    expect(field[0][1].wasWateredToday).toBe(true)
    expect(field[1][0].wasWateredToday).toBe(true)
  })
})
