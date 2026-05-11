import { COW_WEIGHT_MULTIPLIER_MINIMUM } from '../../constants.js'
import { COW_ATTRITION_MESSAGE } from '../../templates.js'

import { removeCowFromInventory } from './removeCowFromInventory.js'

export const processCowAttrition = (state: farmhand.state): farmhand.state => {
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
        message: COW_ATTRITION_MESSAGE('', cow),
        severity: 'error',
      })
    }
  }

  return { ...state, newDayNotifications }
}
