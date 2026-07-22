import { appleCiderVinegar, appleJuice, yeast } from '../data/recipes.js'
import { getKegStub } from '../test-utils/stubs/getKegStub.js'

import { vinegarService } from './vinegar.js'

describe('VinegarService', () => {
  describe('getMaxVinegarYield', () => {
    test.each([
      // Happy path
      {
        recipe: appleCiderVinegar,
        inventory: [
          { id: appleJuice.id, quantity: 10 },
          { id: yeast.id, quantity: 5 },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 1,
      },

      // Constrained by cellar space
      {
        recipe: appleCiderVinegar,
        inventory: [
          { id: appleJuice.id, quantity: Number.MAX_SAFE_INTEGER },
          { id: yeast.id, quantity: Number.MAX_SAFE_INTEGER },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 10,
      },

      // Constrained by yeast inventory
      {
        recipe: appleCiderVinegar,
        inventory: [
          { id: appleJuice.id, quantity: Number.MAX_SAFE_INTEGER },
          { id: yeast.id, quantity: 0 },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 0,
      },

      // Constrained by apple juice inventory
      {
        recipe: appleCiderVinegar,
        inventory: [
          { id: appleJuice.id, quantity: 0 },
          { id: yeast.id, quantity: Number.MAX_SAFE_INTEGER },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 0,
      },

      // Constrained by used cellar space
      {
        recipe: appleCiderVinegar,
        inventory: [
          { id: appleJuice.id, quantity: 10 },
          { id: yeast.id, quantity: Number.MAX_SAFE_INTEGER },
        ],
        cellarInventory: [getKegStub()],
        cellarSize: 2,
        expected: 1,
      },
    ])(
      `
recipe: $recipe.id
apple juice in inventory: $inventory.0.quantity
yeast in inventory: $inventory.1.quantity
cellarInventory length: $cellarInventory.length
cellarSize: $cellarSize
---------------------
expect: $expected

`,
      ({ recipe, inventory, cellarInventory, cellarSize, expected }) => {
        const result = vinegarService.getMaxVinegarYield({
          recipe,
          inventory,
          cellarInventory,
          cellarSize,
        })

        expect(result).toEqual(expected)
      }
    )
  })

  describe('isVinegarRecipe', () => {
    test('identifies a vinegar recipe', () => {
      expect(vinegarService.isVinegarRecipe(appleCiderVinegar)).toBe(true)
    })

    test('rejects a non-vinegar recipe', () => {
      expect(vinegarService.isVinegarRecipe(yeast)).toBe(false)
    })
  })
})
