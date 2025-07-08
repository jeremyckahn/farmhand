import { carrot } from '../../data/crops/index.js'
import { salt } from '../../data/recipes.js'
import { testState } from '../../test-utils/index.js'

import { makeFermentationRecipe } from './makeFermentationRecipe.js'

describe('makeFermentationRecipe', () => {
  test.each([
    // Insufficient salt inventory (no-op)
    [
      testState({
        inventory: [{ id: carrot.id, quantity: 1 }],
        cellarInventory: [],
        purchasedCellar: 1,
      }),
      carrot,
      1,
      testState({
        inventory: [{ id: carrot.id, quantity: 1 }],
        cellarInventory: [],
        purchasedCellar: 1,
      }),
    ],

    // Supplies for one keg
    [
      testState({
        inventory: [
          { id: carrot.id, quantity: 2 },
          { id: salt.id, quantity: 5 },
        ],
        cellarInventory: [],
        purchasedCellar: 1,
      }),
      carrot,
      1,
      testState({
        inventory: [
          { id: carrot.id, quantity: 1 },
          { id: salt.id, quantity: 1 },
        ],
        cellarInventory: [
          { daysUntilMature: 5, itemId: carrot.id, id: expect.toBeString() },
        ],
        purchasedCellar: 1,
      }),
    ],

    // Supplies for multiple kegs
    [
      testState({
        inventory: [
          { id: carrot.id, quantity: 2 },
          { id: salt.id, quantity: 9 },
        ],
        cellarInventory: [],
        purchasedCellar: 1,
      }),
      carrot,
      2,
      testState({
        inventory: [{ id: salt.id, quantity: 1 }],
        cellarInventory: [
          { daysUntilMature: 5, itemId: carrot.id, id: expect.toBeString() },
          { daysUntilMature: 5, itemId: carrot.id, id: expect.toBeString() },
        ],
        purchasedCellar: 1,
      }),
    ],

    // Requesting higher yield than there is salt available for (no-op)
    [
      testState({
        inventory: [
          { id: carrot.id, quantity: 2 },
          { id: salt.id, quantity: 9 },
        ],
        cellarInventory: [],
        purchasedCellar: 1,
      }),
      carrot,
      10,
      testState({
        inventory: [
          { id: carrot.id, quantity: 2 },
          { id: salt.id, quantity: 9 },
        ],
        cellarInventory: [],
        purchasedCellar: 1,
      }),
    ],
  ])(
    'kegs are produced according to input',
    (inputState, fermentationRecipe, howMany, expectedState) => {
      const state = makeFermentationRecipe(
        inputState,
        fermentationRecipe,
        howMany
      )

      expect(state).toEqual(expectedState)
    }
  )
})
