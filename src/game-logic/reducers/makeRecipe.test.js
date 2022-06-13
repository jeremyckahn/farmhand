import { sampleRecipe1 } from '../../data/recipes'

import { INFINITE_STORAGE_LIMIT } from '../../constants'

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
})
