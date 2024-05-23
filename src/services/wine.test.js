import { GRAPES_REQUIRED_FOR_WINE } from '../constants'
import { grapeChardonnay, grapeNebbiolo } from '../data/crops'
import { yeast } from '../data/recipes'
import { getKegStub } from '../test-utils/stubs/getKegStub'
import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine'

import { wineService } from './wine'

describe('WineService', () => {
  describe('getMaxWineYield', () => {
    test.each([
      // Chardonnay

      // Happy path
      {
        grape: grapeChardonnay,
        inventory: [
          { id: grapeChardonnay.id, quantity: GRAPES_REQUIRED_FOR_WINE },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeChardonnay.variety),
          },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 1,
      },

      // Contrained by cellar space
      {
        grape: grapeChardonnay,
        inventory: [
          { id: grapeChardonnay.id, quantity: Number.MAX_SAFE_INTEGER },
          { id: yeast.id, quantity: Number.MAX_SAFE_INTEGER },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 10,
      },

      // Constrained by yeast inventory
      {
        grape: grapeChardonnay,
        inventory: [
          { id: grapeChardonnay.id, quantity: Number.MAX_SAFE_INTEGER },
          { id: yeast.id, quantity: 0 },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 0,
      },

      // Constrained by grape inventory
      {
        grape: grapeChardonnay,
        inventory: [
          { id: grapeChardonnay.id, quantity: 0 },
          { id: yeast.id, quantity: Number.MAX_SAFE_INTEGER },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 0,
      },

      // Constrained by cellar size
      {
        grape: grapeChardonnay,
        inventory: [
          { id: grapeChardonnay.id, quantity: Number.MAX_SAFE_INTEGER },
          { id: yeast.id, quantity: Number.MAX_SAFE_INTEGER },
        ],
        cellarInventory: [],
        cellarSize: 1,
        expected: 1,
      },

      // Constrained by used cellar space
      {
        grape: grapeChardonnay,
        inventory: [
          { id: grapeChardonnay.id, quantity: GRAPES_REQUIRED_FOR_WINE },
          { id: yeast.id, quantity: Number.MAX_SAFE_INTEGER },
        ],
        cellarInventory: [getKegStub()],
        cellarSize: 2,
        expected: 1,
      },

      // Nebbiolo

      // Happy path
      {
        grape: grapeNebbiolo,
        inventory: [
          { id: grapeNebbiolo.id, quantity: GRAPES_REQUIRED_FOR_WINE },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeNebbiolo.variety),
          },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 1,
      },

      // Constrained by yeast inventory
      {
        grape: grapeNebbiolo,
        inventory: [
          { id: grapeNebbiolo.id, quantity: Number.MAX_SAFE_INTEGER },
          { id: yeast.id, quantity: 0 },
        ],
        cellarInventory: [],
        cellarSize: 10,
        expected: 0,
      },
    ])(
      `
  grape: $grape.variety
  grape in inventory: $inventory.0.quantity
  yeast in inventory: $inventory.1.quantity
  cellarInventory length: $cellarInventory.length
  cellarSize: $cellarSize
  ---------------------
  expect: $expected`,
      ({ grape, inventory, cellarInventory, cellarSize, expected }) => {
        const result = wineService.getMaxWineYield(
          grape,
          inventory,
          cellarInventory,
          cellarSize
        )

        expect(result).toEqual(expected)
      }
    )
  })
})
