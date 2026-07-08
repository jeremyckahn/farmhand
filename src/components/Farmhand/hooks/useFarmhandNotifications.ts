import { useCallback } from 'react'

import { recipesMap } from '../../../data/maps.js'
import { INVENTORY_FULL_NOTIFICATION } from '../../../strings.js'
import { RECIPE_LEARNED, RECIPES_LEARNED } from '../../../templates.js'
import { inventorySpaceRemaining } from '../../../utils/inventorySpaceRemaining.js'

export const useFarmhandNotifications = (
  state: farmhand.state,
  boundReducersRef: React.MutableRefObject<any>
) => {
  const showInventoryFullNotifications = useCallback(
    (prev: farmhand.state, currentState: farmhand.state) => {
      if (
        inventorySpaceRemaining(prev) > 0 &&
        inventorySpaceRemaining(currentState) <= 0
      ) {
        boundReducersRef.current.showNotification(
          INVENTORY_FULL_NOTIFICATION,
          'warning'
        )
      }
    },
    [boundReducersRef]
  )

  const showRecipeLearnedNotifications = useCallback(
    ({ learnedRecipes: previousLearnedRecipes }: farmhand.state) => {
      const learnedRecipes: farmhand.recipe[] = []

      Object.keys(state.learnedRecipes).forEach(recipeId => {
        if (!previousLearnedRecipes.hasOwnProperty(recipeId)) {
          learnedRecipes.push(recipesMap[recipeId])
        }
      })

      if (learnedRecipes.length > 1) {
        boundReducersRef.current.showNotification(
          RECIPES_LEARNED('', learnedRecipes)
        )
      } else if (learnedRecipes.length === 1) {
        boundReducersRef.current.showNotification(
          RECIPE_LEARNED('', learnedRecipes[0])
        )
      }
    },
    [state.learnedRecipes, boundReducersRef]
  )

  return {
    showInventoryFullNotifications,
    showRecipeLearnedNotifications,
  }
}
