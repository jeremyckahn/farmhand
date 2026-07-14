import { items as itemImages } from '../img/index.js'

import { getForestFruitImage } from './getForestFruitImage.js'

// apple's treeTimeline is [5, 5, 5, 5, 5] (GROWN from daysOld 25) and
// fruitTimeline is [2, 2, 2] (fruit GROWN from daysSinceLastHarvest 6).
describe('getForestFruitImage', () => {
  test('returns null while the tree itself is not yet grown', () => {
    expect(
      getForestFruitImage({
        itemId: 'apple',
        daysOld: 0,
        daysSinceLastHarvest: 6,
      })
    ).toBe(null)
  })

  test('returns null once the tree is grown but no fruit has grown back yet', () => {
    expect(
      getForestFruitImage({
        itemId: 'apple',
        daysOld: 25,
        daysSinceLastHarvest: 0,
      })
    ).toBe(null)
  })

  test('returns the growing-phase fruit image once fruit starts growing', () => {
    expect(
      getForestFruitImage({
        itemId: 'apple',
        daysOld: 25,
        daysSinceLastHarvest: 3,
      })
    ).toBe(itemImages['apple-fruit-growing-1'])
  })

  test('returns the ripe fruit image once the fruit is grown', () => {
    expect(
      getForestFruitImage({
        itemId: 'apple',
        daysOld: 25,
        daysSinceLastHarvest: 6,
      })
    ).toBe(itemImages['apple-fruit-grown'])
  })
})
