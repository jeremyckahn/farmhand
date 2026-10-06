import { carrot } from '../data/items.js'

import { getItemById } from './getItemById.js'

vitest.mock('../data/maps.js')
vitest.mock('../data/items.js')

describe('getItemById', () => {
  test('returns the item for a known id', () => {
    expect(getItemById('carrot')).toEqual(carrot)
  })

  test('throws an informative error for an unknown id', () => {
    expect(() => getItemById('not-a-real-item')).toThrow(
      'Unknown item id: not-a-real-item'
    )
  })
})
