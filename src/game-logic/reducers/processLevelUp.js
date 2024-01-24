import { levels } from '../../data/levels'
import { levelAchieved } from '../../utils/levelAchieved'
import {
  getRandomLevelUpReward,
  getRandomLevelUpRewardQuantity,
} from '../../utils'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements'
import { SPRINKLER_ITEM_ID } from '../../constants'
import { LEVEL_GAINED_NOTIFICATION } from '../../templates'

import { addItemToInventory } from './addItemToInventory'
import { showNotification } from './showNotification'
import { unlockTool } from './unlockTool'

/**
 * @param {farmhand.state} state
 * @param {number} oldLevel
 * @returns {farmhand.state}
 */
export const processLevelUp = (state, oldLevel) => {
  const { experience, selectedItemId } = state
  const newLevel = levelAchieved(experience)

  // Loop backwards so that the notifications appear in descending order.
  for (let i = newLevel; i > oldLevel; i--) {
    const levelObject = levels[i] || {}

    let randomCropSeed
    // There is no predefined reward for this level up.
    if (Object.keys(levelObject).length < 2) {
      randomCropSeed = getRandomLevelUpReward(i)
      state = addItemToInventory(
        state,
        randomCropSeed,
        getRandomLevelUpRewardQuantity(i),
        true
      )
    } else if (levelObject?.unlocksTool) {
      state = unlockTool(state, levelObject.unlocksTool)
    }
    // This handles an edge case where the player levels up to level that
    // unlocks greater sprinkler range, but the sprinkler item is already
    // selected. In that case, update the hoveredPlotRangeSize state.
    else if (
      levelObject &&
      levelObject.increasesSprinklerRange &&
      selectedItemId === SPRINKLER_ITEM_ID
    ) {
      const { sprinklerRange } = getLevelEntitlements(levelAchieved(experience))

      if (sprinklerRange > state.hoveredPlotRangeSize) {
        state = {
          ...state,
          hoveredPlotRangeSize: sprinklerRange,
        }
      }
    }

    state = showNotification(
      state,
      LEVEL_GAINED_NOTIFICATION`${i}${randomCropSeed}`,
      'success'
    )
  }

  return state
}
