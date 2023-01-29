import { clampNumber } from '../../utils'
import {
  COW_FEED_ITEM_ID,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
} from '../../constants'
import { OUT_OF_COW_FEED_NOTIFICATION } from '../../strings'

import { decrementItemFromInventory } from './decrementItemFromInventory'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processFeedingCows = state => {
  const cowInventory = [...state.cowInventory]
  const { length: cowInventoryLength } = cowInventory
  const newDayNotifications = [...state.newDayNotifications]
  const inventory = [...state.inventory]

  const cowFeedInventoryPosition = inventory.findIndex(
    ({ playerId }) => playerId === COW_FEED_ITEM_ID
  )

  const cowFeed = inventory[cowFeedInventoryPosition]
  const quantity = cowFeed ? cowFeed.quantity : 0

  let unitsSpent = 0

  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]
    const anyUnitsRemain = unitsSpent < quantity

    cowInventory[i] = {
      ...cow,
      weightMultiplier: clampNumber(
        anyUnitsRemain
          ? cow.weightMultiplier + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
          : cow.weightMultiplier - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
        COW_WEIGHT_MULTIPLIER_MINIMUM,
        COW_WEIGHT_MULTIPLIER_MAXIMUM
      ),
    }

    if (anyUnitsRemain) {
      unitsSpent++
    }
  }

  if (quantity <= cowInventoryLength && cowInventoryLength > 0) {
    newDayNotifications.push({
      message: OUT_OF_COW_FEED_NOTIFICATION,
      severity: 'error',
    })
  }

  return decrementItemFromInventory(
    { ...state, cowInventory, inventory, newDayNotifications },
    COW_FEED_ITEM_ID,
    unitsSpent
  )
}
