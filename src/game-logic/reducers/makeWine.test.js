/**
 * @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state
 */

import { grapeChardonnay } from '../../data/crops'
import { yeast, wineChardonnay } from '../../data/recipes'
import { grapeVariety } from '../../enums'
import { cellarService } from '../../services/cellar'
import { getYeastRequiredForWine } from '../../utils/getYeastRequiredForWine'

import { makeWine } from './makeWine'

const stubKegUuid = 'abc123'

beforeEach(() => {
  // @ts-expect-error
  jest.spyOn(cellarService, '_uuid').mockReturnValue(stubKegUuid)
})

describe('makeWine', () => {
  test.each([
    // Insufficient ingredients
    {
      /** @type {Partial<state>} */
      state: {
        inventory: [],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      wineVariety: grapeVariety.CHARDONNAY,
      howMany: 1,
      /** @type {Partial<state>} */
      expected: {
        inventory: [],
        cellarInventory: [],
        purchasedCellar: 2,
      },
    },

    // Ingredients for one wine
    {
      /** @type {Partial<state>} */
      state: {
        inventory: [
          { id: grapeChardonnay.id, quantity: 1 },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeChardonnay.variety),
          },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      wineVariety: grapeVariety.CHARDONNAY,
      howMany: 1,
      /** @type {Partial<state>} */
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
      /** @type {Partial<state>} */
      state: {
        inventory: [
          { id: grapeChardonnay.id, quantity: 1 },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeChardonnay.variety) + 1,
          },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      wineVariety: grapeVariety.CHARDONNAY,
      howMany: 1,
      /** @type {Partial<state>} */
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
      /** @type {Partial<state>} */
      state: {
        inventory: [
          { id: grapeChardonnay.id, quantity: 1 },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeChardonnay.variety),
          },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      wineVariety: grapeVariety.CHARDONNAY,
      howMany: 10,
      /** @type {Partial<state>} */
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
      /** @type {Partial<state>} */
      state: {
        inventory: [
          { id: grapeChardonnay.id, quantity: 2 },
          {
            id: yeast.id,
            quantity: getYeastRequiredForWine(grapeChardonnay.variety) * 2,
          },
        ],
        cellarInventory: [],
        purchasedCellar: 2,
      },
      grape: grapeChardonnay,
      wineVariety: grapeVariety.CHARDONNAY,
      howMany: 10,
      /** @type {Partial<state>} */
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
    ({ state, grape, wineVariety, howMany, expected }) => {
      // @ts-expect-error
      const result = makeWine(state, grape, wineVariety, howMany)

      expect(result).toEqual(expected)
    }
  )
})
