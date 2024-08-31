import upgrades from '../../data/upgrades.js'
import { TOOL_UPGRADED_NOTIFICATION } from '../../templates.js'

import { showNotification } from './showNotification.js'
import { makeRecipe } from './makeRecipe.js'

// TODO: Add tests for this reducer
/**
 * @param {farmhand.state} state
 * @param {farmhand.upgrade} upgrade
 */
export const upgradeTool = (state, upgrade) => {
  state = makeRecipe(state, upgrade)

  const currentName =
    upgrades[upgrade.toolType][state.toolLevels[upgrade.toolType]].name
  state.toolLevels[upgrade.toolType] = upgrade.level

  state = showNotification(
    state,
    TOOL_UPGRADED_NOTIFICATION`${currentName}${upgrade.name}`
  )

  return { ...state }
}
