import {
  doesInventorySpaceRemain,
  getCowFertilizerItem,
  getCowFertilizerProductionRate,
} from '../../utils/index.js'
import { FERTILIZERS_PRODUCED } from '../../templates.js'

import { addItemToInventory } from './addItemToInventory.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processCowFertilizerProduction = state => {
  const cowInventory = [...state.cowInventory]
  const newDayNotifications = [...state.newDayNotifications]
  const { length: cowInventoryLength } = cowInventory
  const fertilizersProduced = {}

  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]

    if (
      // `cow.daysSinceProducingFertilizer || 0` is needed because legacy cows
      // did not define daysSinceProducingFertilizer.
      (cow.daysSinceProducingFertilizer || 0) >
      getCowFertilizerProductionRate(cow)
    ) {
      cowInventory[i] = { ...cow, daysSinceProducingFertilizer: 0 }

      const fertilizer = getCowFertilizerItem(cow)
      const { name } = fertilizer

      if (!doesInventorySpaceRemain(state)) {
        break
      }

      fertilizersProduced[name] = (fertilizersProduced[name] || 0) + 1
      state = addItemToInventory(state, fertilizer)
    }
  }

  if (Object.keys(fertilizersProduced).length) {
    newDayNotifications.push({
      message: FERTILIZERS_PRODUCED`${fertilizersProduced}`,
      severity: 'success',
    })
  }

  return { ...state, cowInventory, newDayNotifications }
}
