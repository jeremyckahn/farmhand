import { recipesMap } from '../../data/maps.js'

export const updateLearnedRecipes = (
  state: farmhand.state
): farmhand.state => ({
  ...state,
  learnedRecipes: Object.keys(recipesMap).reduce((acc, recipeId) => {
    if (recipesMap[recipeId].condition(state)) {
      acc[recipeId] = true
    }

    return acc
  }, {}),
})
