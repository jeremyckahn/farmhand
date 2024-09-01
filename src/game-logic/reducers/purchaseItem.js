import {
  getAdjustedItemValue,
  inventorySpaceRemaining,
  moneyTotal,
} from '../../utils/index.js'
import { PURCHASED_ITEM_PEER_NOTIFICATION } from '../../templates.js'

import { addItemToInventory } from './addItemToInventory.js'

import { prependPendingPeerMessage } from './index.js'

/**
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const purchaseItem = (state, item, howMany = 1) => {
  const { money, todaysPurchases, valueAdjustments } = state
  const numberOfItemsToAdd = Math.min(howMany, inventorySpaceRemaining(state))

  if (numberOfItemsToAdd === 0) {
    return state
  }

  const value = getAdjustedItemValue(valueAdjustments, item.id)
  const totalValue = value * numberOfItemsToAdd

  if (totalValue > money) {
    return state
  }

  state = prependPendingPeerMessage(
    state,
    PURCHASED_ITEM_PEER_NOTIFICATION`${howMany}${item}`
  )

  return addItemToInventory(
    {
      ...state,
      money: moneyTotal(money, -totalValue),
      todaysPurchases: {
        ...todaysPurchases,
        [item.id]: (todaysPurchases[item.id] || 0) + numberOfItemsToAdd,
      },
    },
    item,
    numberOfItemsToAdd
  )
}
