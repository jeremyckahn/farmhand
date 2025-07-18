import upgrades from '../../data/upgrades.js'
import { TOOL_UPGRADED_NOTIFICATION } from '../../templates.js'
import { EXPERIENCE_VALUES } from '../../constants.js'

import { showNotification } from './showNotification.js'
import { consumeIngredients } from './consumeIngredients.js'
import { addItemToInventory } from './addItemToInventory.js'

/**
 * @param {farmhand.state} state
 * @param {farmhand.upgradesMetadatum} upgrade
 */
export const upgradeTool = (state, upgrade) => {
  // Validate required properties
  if (!upgrade.toolType || !upgrade.level) {
    return state
  }

  const originalState = state
  state = consumeIngredients(
    state,
    upgrade,
    1,
    EXPERIENCE_VALUES.FORGE_RECIPE_MADE
  )

  // If ingredient consumption failed, return original state
  if (state === originalState) {
    return state
  }

  // Add the upgrade object to inventory
  state = addItemToInventory(state, upgrade, 1)

  const currentName =
    upgrades[upgrade.toolType][state.toolLevels[upgrade.toolType]].name
  state.toolLevels[upgrade.toolType] = upgrade.level

  state = showNotification(
    state,
    TOOL_UPGRADED_NOTIFICATION('', currentName, upgrade.name)
  )

  return { ...state }
}
