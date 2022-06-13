import { testItem } from '../../../test-utils'

import { getPlayerInventoryQuantities } from './getPlayerInventoryQuantities'

jest.mock('../../../data/maps')

describe('playerInventoryQuantities', () => {
  test('computes a map of item IDs to their quantity in the inventory', () => {
    const playerInventoryQuantities = getPlayerInventoryQuantities([
      testItem({ id: 'sample-item-1', quantity: 1 }),
      testItem({ id: 'sample-item-2', quantity: 2 }),
    ])

    expect(playerInventoryQuantities).toEqual(
      expect.objectContaining({
        'sample-item-1': 1,
        'sample-item-2': 2,
        'sample-item-3': 0,
      })
    )
  })
})
