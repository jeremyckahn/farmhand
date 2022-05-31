import { updateLearnedRecipes } from './updateLearnedRecipes'

jest.mock('../../data/recipes')

describe('updateLearnedRecipes', () => {
  describe('recipe condition is not met', () => {
    test('recipe is not in the returned map', () => {
      const { learnedRecipes } = updateLearnedRecipes({
        itemsSold: {},
      })

      expect(learnedRecipes['sample-recipe-1']).toBe(undefined)
    })
  })

  describe('recipe condition is met', () => {
    test('recipe is in the returned map', () => {
      const { learnedRecipes } = updateLearnedRecipes({
        itemsSold: { 'sample-item-1': 3 },
      })

      expect(learnedRecipes['sample-recipe-1']).toEqual(true)
    })
  })
})
