import { appleCiderVinegar, appleJuice, yeast } from '../../data/recipes.js'
import { cellarService } from '../../services/cellar.js'

import { makeVinegar } from './makeVinegar.js'

const stubKegUuid = 'abc123'

beforeEach(() => {
  vitest.spyOn(cellarService, '_uuid').mockReturnValue(stubKegUuid as any)
})

describe('makeVinegar', () => {
  test.each([
    // Insufficient ingredients
    {
      state: {
        inventory: [],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      recipe: appleCiderVinegar,
      howMany: 1,
      expected: {
        inventory: [],
        cellarInventory: [],
        purchasedCellar: 2,
      },
    },

    // Ingredients for one vinegar
    {
      state: {
        inventory: [
          { id: appleJuice.id, quantity: 10 },
          { id: yeast.id, quantity: 5 },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      recipe: appleCiderVinegar,
      howMany: 1,
      expected: {
        inventory: [],
        cellarInventory: [
          {
            id: stubKegUuid,
            daysUntilMature: appleCiderVinegar.daysToMature,
            itemId: appleCiderVinegar.id,
          },
        ],
        purchasedCellar: 2,
      },
    },

    // Ingredients for one vinegar with leftover yeast
    {
      state: {
        inventory: [
          { id: appleJuice.id, quantity: 10 },
          { id: yeast.id, quantity: 6 },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      recipe: appleCiderVinegar,
      howMany: 1,
      expected: {
        inventory: [{ id: yeast.id, quantity: 1 }],
        cellarInventory: [
          {
            id: stubKegUuid,
            daysUntilMature: appleCiderVinegar.daysToMature,
            itemId: appleCiderVinegar.id,
          },
        ],
        purchasedCellar: 2,
      },
    },

    // Ingredients for multiple vinegars but requesting more
    {
      state: {
        inventory: [
          { id: appleJuice.id, quantity: 20 },
          { id: yeast.id, quantity: 10 },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      recipe: appleCiderVinegar,
      howMany: 10,
      expected: {
        inventory: [],
        cellarInventory: [
          {
            id: stubKegUuid,
            daysUntilMature: appleCiderVinegar.daysToMature,
            itemId: appleCiderVinegar.id,
          },
          {
            id: stubKegUuid,
            daysUntilMature: appleCiderVinegar.daysToMature,
            itemId: appleCiderVinegar.id,
          },
        ],
        purchasedCellar: 2,
      },
    },
  ])(
    'makes $expected.cellarInventory.length vinegar unit(s) based on $state.inventory.0.id: $state.inventory.0.quantity, $state.inventory.1.id: $state.inventory.1.quantity',
    ({ state, recipe, howMany, expected }) => {
      const result = makeVinegar(state as any, recipe as any, howMany)

      expect(result).toEqual(expected)
    }
  )
})
