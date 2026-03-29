import { testState } from '../../test-utils/index.js'

import { updateInventoryRecordsForNextDay } from './updateInventoryRecordsForNextDay.js'

describe('updateInventoryRecordsForNextDay', () => {
  test('records inventory records for next day', () => {
    const {
      todaysPurchases,
      todaysStartingInventory,
    } = updateInventoryRecordsForNextDay(
      testState({
        inventory: [
          { id: 'sample-item-1', quantity: 2 },
          { id: 'sample-item-2', quantity: 5 },
        ],
        todaysPurchases: {
          'sample-item-3': 3,
        },
      })
    )

    expect(todaysPurchases).toEqual({})
    expect(todaysStartingInventory).toEqual({
      'sample-item-1': 2,
      'sample-item-2': 5,
    })
  })
})
