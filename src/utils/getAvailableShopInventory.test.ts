import { cowFeed, huggingMachine, scarecrow } from '../data/items.js'

import { getAvailableShopInventory } from './getAvailableShopInventory.js'

describe('getAvailableShopInventory', () => {
  test('computes shop inventory that has been unlocked', async () => {
    expect(
      getAvailableShopInventory({
        items: {},
        sprinklerRange: 0,
        tools: {},
        stageFocusType: {},
      } as any)
    ).toEqual([scarecrow, cowFeed, huggingMachine])
  })
})
