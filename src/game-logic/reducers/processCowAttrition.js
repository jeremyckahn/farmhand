import { COW_WEIGHT_MULTIPLIER_MINIMUM } from '../../constants'
import { COW_ATTRITION_MESSAGE } from '../../templates'

import { removeCowFromInventory } from './removeCowFromInventory'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processCowAttrition = state => {
  const newDayNotifications = [...state.newDayNotifications]
  const oldCowInventory = [...state.cowInventory]

  for (let i = 0; i < oldCowInventory.length; i++) {
    const cow = oldCowInventory[i]

    if (
      // Cast toFixed(2) to prevent IEEE 754 rounding errors.
      Number(cow.weightMultiplier.toFixed(2)) === COW_WEIGHT_MULTIPLIER_MINIMUM
    ) {
      state = removeCowFromInventory(state, cow)

      newDayNotifications.push({
        message: COW_ATTRITION_MESSAGE`${cow}`,
        severity: 'error',
      })
    }
  }

  return { ...state, newDayNotifications }
}
