import { recipesMap } from '../../data/maps.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const updateLearnedRecipes = state => ({
  ...state,
  learnedRecipes: Object.keys(recipesMap).reduce((acc, recipeId) => {
    if (recipesMap[recipeId].condition(state)) {
      acc[recipeId] = true
    }

    return acc
  }, {}),
})
