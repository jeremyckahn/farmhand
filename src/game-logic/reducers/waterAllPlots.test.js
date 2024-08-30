import { testCrop } from '../../test-utils'

import { waterAllPlots } from './waterAllPlots'

vitest.mock('../../data/maps')
vitest.mock('../../data/items')

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
