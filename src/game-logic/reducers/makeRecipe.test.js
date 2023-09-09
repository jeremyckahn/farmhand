import { sampleRecipe1 } from '../../data/recipes'

import { EXPERIENCE_VALUES, INFINITE_STORAGE_LIMIT } from '../../constants'

import { recipeType } from '../../enums'

import { makeRecipe } from './makeRecipe'

jest.mock('../../data/recipes')

describe('makeRecipe', () => {
  describe('there are insufficient ingredients for recipe', () => {
    test('the recipe is not made', () => {
      const { inventory } = makeRecipe(
        {
          inventory: [{ id: 'sample-item-1', quantity: 1 }],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        },
        sampleRecipe1
      )

      expect(inventory).toEqual([{ id: 'sample-item-1', quantity: 1 }])
    })
  })

  describe('there are sufficient ingredients for recipe', () => {
    test('consumes ingredients and adds recipe item to inventory', () => {
      const { inventory } = makeRecipe(
        {
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        },
        sampleRecipe1
      )

      expect(inventory).toEqual([
        { id: 'sample-item-1', quantity: 1 },
        { id: 'sample-recipe-1', quantity: 1 },
      ])
    })
  })

  describe('experience', () => {
    let state

    beforeEach(() => {
      state = {
        experience: 0,
        inventory: [],
      }

      jest.mock('../../utils', () => ({
        ...jest.requireActual('../../utils'),
        canMakeRecipe: jest.fn(() => true),
      }))
    })

    test.each([
      [recipeType.FERMENTATION, EXPERIENCE_VALUES.FERMENTATION_RECIPE_MADE],
      [recipeType.FORGE, EXPERIENCE_VALUES.FORGE_RECIPE_MADE],
      [recipeType.KITCHEN, EXPERIENCE_VALUES.KITCHEN_RECIPE_MADE],
      [recipeType.RECYCLING, EXPERIENCE_VALUES.RECYCLING_RECIPE_MADE],
    ])('adds experience for a %s recipe', (recipeType, experienceValue) => {
      const { experience } = makeRecipe(state, {
        ingredients: {},
        recipeType,
      })

      expect(experience).toEqual(experienceValue)
    })
  })
})
