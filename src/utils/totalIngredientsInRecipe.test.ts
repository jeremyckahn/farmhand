import { totalIngredientsInRecipe } from './totalIngredientsInRecipe.js'

describe('totalIngredientsInRecipe', () => {
  test('it can total a single ingredient upgrade', () => {
    const upgrade = {
      ingredients: { carrot: 5 },
    }

    expect(totalIngredientsInRecipe(upgrade)).toEqual(5)
  })

  test('it can total a multiple ingredient upgrade', () => {
    const upgrade = {
      ingredients: { carrot: 5, potato: 8, chili: 2 },
    }

    expect(totalIngredientsInRecipe(upgrade)).toEqual(15)
  })
})
