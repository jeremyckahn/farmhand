import { carrot } from '../../data/crops'
import { salt } from '../../data/recipes'

import { makeFermentationRecipe } from './makeFermentationRecipe'

describe('makeFermentationRecipe', () => {
  test.each([
    // Insufficient salt inventory (no-op)
    [
      {
        inventory: [{ id: carrot.id, quantity: 1 }],
        cellarInventory: [],
        purchasedCellar: 1,
      },
      carrot,
      1,
      {
        inventory: [{ id: carrot.id, quantity: 1 }],
        cellarInventory: [],
        purchasedCellar: 1,
      },
    ],

    // Supplies for one keg
    [
      {
        inventory: [
          { id: carrot.id, quantity: 2 },
          { id: salt.id, quantity: 4 },
        ],
        cellarInventory: [],
        purchasedCellar: 1,
      },
      carrot,
      1,
      {
        inventory: [{ id: carrot.id, quantity: 1 }],
        cellarInventory: [
          { daysUntilMature: 5, itemId: carrot.id, id: expect.toBeString() },
        ],
        purchasedCellar: 1,
      },
    ],

    // Supplies for multiple kegs
    [
      {
        inventory: [
          { id: carrot.id, quantity: 2 },
          { id: salt.id, quantity: 9 },
        ],
        cellarInventory: [],
        purchasedCellar: 1,
      },
      carrot,
      2,
      {
        inventory: [{ id: salt.id, quantity: 1 }],
        cellarInventory: [
          { daysUntilMature: 5, itemId: carrot.id, id: expect.toBeString() },
          { daysUntilMature: 5, itemId: carrot.id, id: expect.toBeString() },
        ],
        purchasedCellar: 1,
      },
    ],

    // Requesting higher yield than there is salt available for (no-op)
    [
      {
        inventory: [
          { id: carrot.id, quantity: 2 },
          { id: salt.id, quantity: 9 },
        ],
        cellarInventory: [],
        purchasedCellar: 1,
      },
      carrot,
      10,
      {
        inventory: [
          { id: carrot.id, quantity: 2 },
          { id: salt.id, quantity: 9 },
        ],
        cellarInventory: [],
        purchasedCellar: 1,
      },
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
