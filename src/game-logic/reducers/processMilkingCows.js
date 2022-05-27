import {
  doesInventorySpaceRemain,
  getCowMilkItem,
  getCowMilkRate,
} from '../../utils'
import { MILKS_PRODUCED } from '../../templates'

import { addItemToInventory } from './addItemToInventory'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processMilkingCows = state => {
  const cowInventory = [...state.cowInventory]
  const newDayNotifications = [...state.newDayNotifications]
  const { length: cowInventoryLength } = cowInventory
  const milksProduced = {}

  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]

    if (cow.daysSinceMilking > getCowMilkRate(cow)) {
      cowInventory[i] = { ...cow, daysSinceMilking: 0 }

      const milk = getCowMilkItem(cow)
      const { name } = milk

      if (!doesInventorySpaceRemain(state)) {
        break
      }

      milksProduced[name] = (milksProduced[name] || 0) + 1
      state = addItemToInventory(state, milk)
    }
  }

  if (Object.keys(milksProduced).length) {
    newDayNotifications.push({
      message: MILKS_PRODUCED`${milksProduced}`,
      severity: 'success',
    })
  }

  return { ...state, cowInventory, newDayNotifications }
}
