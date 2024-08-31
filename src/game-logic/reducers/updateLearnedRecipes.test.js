import { updateLearnedRecipes } from './updateLearnedRecipes.js'

describe('updateLearnedRecipes', () => {
  describe('recipe condition is not met', () => {
    test('recipe is not in the returned map', () => {
      const { learnedRecipes } = updateLearnedRecipes({
        itemsSold: {},
      })

      expect(learnedRecipes['carrot-soup']).toBe(undefined)
    })
  })

  describe('recipe condition is met', () => {
    test('recipe is in the returned map', () => {
      const { learnedRecipes } = updateLearnedRecipes({
        itemsSold: { carrot: Number.MAX_SAFE_INTEGER },
      })

      expect(learnedRecipes['carrot-soup']).toEqual(true)
    })
  })
})
