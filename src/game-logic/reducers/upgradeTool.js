import upgrades from '../../data/upgrades.js'
import { TOOL_UPGRADED_NOTIFICATION } from '../../templates.js'

import { showNotification } from './showNotification.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

// TODO: Add tests for this reducer
/**
 * @param {farmhand.state} state
 * @param {farmhand.upgradesMetadatum} upgrade
 */
export const upgradeTool = (state, upgrade) => {
  // Validate required properties
  if (!upgrade.toolType || !upgrade.level) {
    return state
  }

  // Decrement ingredients from inventory
  if (upgrade.ingredients) {
    const ingredients = upgrade.ingredients
    state = Object.keys(ingredients).reduce(
      (state, ingredientId) =>
        decrementItemFromInventory(
          state,
          ingredientId,
          ingredients[ingredientId]
        ),
      state
    )
  }

  const currentName =
    upgrades[upgrade.toolType][state.toolLevels[upgrade.toolType]].name
  state.toolLevels[upgrade.toolType] = upgrade.level

  state = showNotification(
    state,
    TOOL_UPGRADED_NOTIFICATION('', currentName, upgrade.name)
  )

  return { ...state }
}
