import { v4 as uuid } from 'uuid'

import { carrot } from '../data/crops'
import { salt } from '../data/recipes'

import { maxYieldOfFermentationRecipe } from './maxYieldOfFermentationRecipe'

describe('maxYieldOfFermentationRecipe', () => {
  test.each([
    // Happy path
    [
      [
        { id: carrot.id, quantity: 10 },
        { id: salt.id, quantity: 10 },
      ],
      [{ id: uuid(), itemId: carrot.id, daysUntilMature: 0 }],
      10,
      2,
    ],
    // Insufficient salt
    [
      [
        { id: carrot.id, quantity: 10 },
        { id: salt.id, quantity: 0 },
      ],
      [{ id: uuid(), itemId: carrot.id, daysUntilMature: 0 }],
      10,
      0,
    ],
    // Insufficient item quantity in inventory
    [
      [
        { id: carrot.id, quantity: 0 },
        { id: salt.id, quantity: 10 },
      ],
      [{ id: uuid(), itemId: carrot.id, daysUntilMature: 0 }],
      10,
      0,
    ],
    // Insufficient cellar space
    [
      [
        { id: carrot.id, quantity: 10 },
        { id: salt.id, quantity: 10 },
      ],
      [{ id: uuid(), itemId: carrot.id, daysUntilMature: 0 }],
      1,
      0,
    ],
  ])(
    'computes max potential yield of a given recipe',
    (inventory, cellarInventory, cellarSize, expectedYield) => {
      const maxYield = maxYieldOfFermentationRecipe(
        carrot,
        inventory,
        cellarInventory,
        cellarSize
      )

      expect(maxYield).toBe(expectedYield)
    }
  )
})
