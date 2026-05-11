import { GRAPES_REQUIRED_FOR_WINE } from '../../constants.js'
import { grapeChardonnay } from '../../data/crops/index.js'
import { yeast, wineChardonnay } from '../../data/recipes.js'
import { cellarService } from '../../services/cellar.js'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine.js'

import { makeWine } from './makeWine.js'

const stubKegUuid = 'abc123'

beforeEach(() => {
  vitest.spyOn(cellarService, '_uuid').mockReturnValue(stubKegUuid as any)
})

describe('makeWine', () => {
  test.each([
    // Insufficient ingredients
    {
      state: {
        inventory: [],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      howMany: 1,
      expected: {
        inventory: [],
        cellarInventory: [],
        purchasedCellar: 2,
      },
    },

    // Ingredients for one wine
    {
      state: {
        inventory: [
          { id: grapeChardonnay.id, quantity: GRAPES_REQUIRED_FOR_WINE },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeChardonnay.variety),
          },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      howMany: 1,
      expected: {
        inventory: [],
        cellarInventory: [
          {
            id: stubKegUuid,
            daysUntilMature: getYeastRequiredForWine(grapeChardonnay.variety),
            itemId: wineChardonnay.id,
          },
        ],
        purchasedCellar: 2,
      },
    },

    // Ingredients for one wine with leftover yeast
    {
      state: {
        inventory: [
          { id: grapeChardonnay.id, quantity: GRAPES_REQUIRED_FOR_WINE },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeChardonnay.variety) + 1,
          },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      howMany: 1,
      expected: {
        inventory: [
          {
            id: yeast.id,
            quantity: 1,
          },
        ],
        cellarInventory: [
          {
            id: stubKegUuid,
            daysUntilMature: getYeastRequiredForWine(grapeChardonnay.variety),
            itemId: wineChardonnay.id,
          },
        ],
        purchasedCellar: 2,
      },
    },

    // Ingredients for one wine but requesting more
    {
      state: {
        inventory: [
          { id: grapeChardonnay.id, quantity: GRAPES_REQUIRED_FOR_WINE },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeChardonnay.variety),
          },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      howMany: 10,
      expected: {
        inventory: [],
        cellarInventory: [
          {
            id: stubKegUuid,
            daysUntilMature: getYeastRequiredForWine(grapeChardonnay.variety),
            itemId: wineChardonnay.id,
          },
        ],
        purchasedCellar: 2,
      },
    },

    // Ingredients for multiple wines but requesting more
    {
      state: {
        inventory: [
          { id: grapeChardonnay.id, quantity: GRAPES_REQUIRED_FOR_WINE * 2 },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeChardonnay.variety) * 2,
          },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      howMany: 10,
      expected: {
        inventory: [],
        cellarInventory: [
          {
            id: stubKegUuid,
            daysUntilMature: getYeastRequiredForWine(grapeChardonnay.variety),
            itemId: wineChardonnay.id,
          },
          {
            id: stubKegUuid,
            daysUntilMature: getYeastRequiredForWine(grapeChardonnay.variety),
            itemId: wineChardonnay.id,
          },
        ],
        purchasedCellar: 2,
      },
    },
  ])(
    'makes $expected.cellarInventory.length wine unit(s) based on $state.inventory.0.id: $state.inventory.0.quantity, $state.inventory.1.id: $state.inventory.1.quantity',
    ({ state, grape, howMany, expected }) => {
      const result = makeWine(state as any, grape as any, howMany)

      expect(result).toEqual(expected)
    }
  )
})
