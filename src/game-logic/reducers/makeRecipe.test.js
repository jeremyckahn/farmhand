import { carrotSoup } from '../../data/recipes.js'
import { carrot } from '../../data/crops/index.js'
import { testState } from '../../test-utils/index.js'

import { EXPERIENCE_VALUES, INFINITE_STORAGE_LIMIT } from '../../constants.js'

import { recipeType } from '../../enums.js'

import { makeRecipe } from './makeRecipe.js'

describe('makeRecipe', () => {
  describe('there are insufficient ingredients for recipe', () => {
    test('the recipe is not made', () => {
      const { inventory } = makeRecipe(
        testState({
          inventory: [{ id: 'carrot', quantity: 1 }],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        }),
        carrotSoup
      )

      expect(inventory).toEqual([{ id: 'carrot', quantity: 1 }])
    })
  })

  describe('there are sufficient ingredients for recipe', () => {
    test('consumes ingredients and adds recipe item to inventory', () => {
      const { inventory } = makeRecipe(
        testState({
          inventory: [{ id: carrot.id, quantity: 5 }],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        }),
        carrotSoup
      )

      expect(inventory).toEqual([
        { id: carrot.id, quantity: 1 },
        { id: carrotSoup.id, quantity: 1 },
      ])
    })
  })

  describe('experience', () => {
    let state

    beforeEach(() => {
      state = testState({
        experience: 0,
        inventory: [],
      })
    })

    test.each([
      [recipeType.FERMENTATION, EXPERIENCE_VALUES.FERMENTATION_RECIPE_MADE],
      [recipeType.FORGE, EXPERIENCE_VALUES.FORGE_RECIPE_MADE],
      [recipeType.KITCHEN, EXPERIENCE_VALUES.KITCHEN_RECIPE_MADE],
      [recipeType.RECYCLING, EXPERIENCE_VALUES.RECYCLING_RECIPE_MADE],
    ])('adds experience for a %s recipe', (recipeType, experienceValue) => {
      const { experience } = makeRecipe(state, {
        ...carrotSoup,
        ingredients: {},
        recipeType,
      })

      expect(experience).toEqual(experienceValue)
    })
  })
})
