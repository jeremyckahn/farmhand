import { itemsMap } from '../../data/maps'
import {
  castToMoney,
  farmProductsSold,
  getAdjustedItemValue,
  getResaleValue,
  getSalePriceMultiplier,
  isItemAFarmProduct,
  isItemSoldInShop,
  levelAchieved,
  moneyTotal,
} from '../../utils'
import { LOAN_GARNISHMENT_RATE } from '../../constants'
import { SOLD_ITEM_PEER_NOTIFICATION } from '../../templates'

import { decrementItemFromInventory } from './decrementItemFromInventory'
import { processLevelUp } from './processLevelUp'
import { addRevenue } from './addRevenue'
import { updateLearnedRecipes } from './updateLearnedRecipes'
import { adjustLoan } from './adjustLoan'

import { prependPendingPeerMessage } from './index'

/**
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const sellItem = (state, { id }, howMany = 1) => {
  if (howMany === 0) {
    return state
  }

  const item = itemsMap[id]
  const {
    completedAchievements,
    itemsSold,
    money: initialMoney,
    valueAdjustments,
  } = state
  const oldLevel = levelAchieved(farmProductsSold(itemsSold))
  let { loanBalance } = state

  const adjustedItemValue = isItemSoldInShop(item)
    ? getResaleValue(item)
    : getAdjustedItemValue(valueAdjustments, id)
  const saleIsGarnished = isItemAFarmProduct(item)
  let saleValue = 0
  for (let i = 0; i < howMany; i++) {
    const loanGarnishment = saleIsGarnished
      ? Math.min(
          loanBalance,
          castToMoney(adjustedItemValue * LOAN_GARNISHMENT_RATE)
        )
      : 0
    const garnishedProfit =
      adjustedItemValue * getSalePriceMultiplier(completedAchievements) -
      loanGarnishment
    loanBalance = moneyTotal(loanBalance, -loanGarnishment)
    saleValue = moneyTotal(saleValue, garnishedProfit)
  }

  if (saleIsGarnished) {
    state = adjustLoan(state, moneyTotal(loanBalance, -state.loanBalance))
  }

  const newItemsSold = { ...itemsSold, [id]: (itemsSold[id] || 0) + howMany }

  if (item.isPlantableCrop) {
    state = { ...state, money: moneyTotal(initialMoney, saleValue) }
  } else {
    // money needs to be passed in explicitly here because state.money gets
    // mutated above and addRevenue needs its initial value.
    state = addRevenue({ ...state, money: initialMoney }, saleValue)
  }

  state = {
    ...state,
    itemsSold: newItemsSold,
  }

  state = processLevelUp(state, oldLevel)
  state = decrementItemFromInventory(state, id, howMany)

  state = prependPendingPeerMessage(
    state,
    SOLD_ITEM_PEER_NOTIFICATION`${howMany}${item}`,
    'warning'
  )

  return updateLearnedRecipes(state)
}
