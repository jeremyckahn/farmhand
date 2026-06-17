import { PURCHASED_ITEM_PEER_NOTIFICATION } from '../../templates.js'


import { getAdjustedItemValue } from "../../utils/getAdjustedItemValue.js";
import { inventorySpaceRemaining } from "../../utils/inventorySpaceRemaining.js";
import { moneyTotal } from "../../utils/moneyTotal.js";

import { addItemToInventory } from './addItemToInventory.js'

import { prependPendingPeerMessage } from './index.js'

export const purchaseItem = (
  state: farmhand.state,
  item: farmhand.item,
  howMany: number = 1
): farmhand.state => {
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
    PURCHASED_ITEM_PEER_NOTIFICATION('', howMany, item)
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
