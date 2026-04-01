import upgrades from '../../data/upgrades.ts'
import { TOOL_UPGRADED_NOTIFICATION } from '../../templates.ts'
import { EXPERIENCE_VALUES } from '../../constants.ts'

import { showNotification } from './showNotification.ts'
import { consumeIngredients } from './consumeIngredients.ts'
import { addItemToInventory } from './addItemToInventory.ts'

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
