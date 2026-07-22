import { carrot } from '../data/crops/index.js'
import {
  appleCiderVinegar,
  appleJuice,
  balsamicVinegar,
} from '../data/recipes.js'

import { getVinegarRecipesAvailableToMake } from './getVinegarRecipesAvailableToMake.js'

describe('getVinegarRecipesAvailableToMake', () => {
  test.each([
    [{}, []],
    [
      {
        [carrot.id]: 1,
      },
      [],
    ],
    [
      {
        [appleJuice.id]: 1,
      },
      [appleCiderVinegar],
    ],
  ])('calculates vinegar recipes available', (itemsSold, expected) => {
    const result = getVinegarRecipesAvailableToMake(itemsSold)

    expect(result).toEqual(expected)
  })

  test('includes multiple unlocked vinegar recipes', () => {
    const result = getVinegarRecipesAvailableToMake({
      [appleJuice.id]: 1,
      [balsamicVinegar.unlockItemId]: 1,
    })

    expect(result).toEqual([appleCiderVinegar, balsamicVinegar])
  })
})
