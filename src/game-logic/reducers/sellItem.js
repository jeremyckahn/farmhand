import { itemsMap } from '../../data/maps.js'
import { isItemAFarmProduct } from '../../utils/isItemAFarmProduct.js'
import {
  castToMoney,
  getAdjustedItemValue,
  getResaleValue,
  getSalePriceMultiplier,
  isItemSoldInShop,
  moneyTotal,
} from '../../utils/index.js'
import { LOAN_GARNISHMENT_RATE, EXPERIENCE_VALUES } from '../../constants.js'
import { SOLD_ITEM_PEER_NOTIFICATION } from '../../templates.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { addExperience } from './addExperience.js'
import { addRevenue } from './addRevenue.js'
import { updateLearnedRecipes } from './updateLearnedRecipes.js'
import { adjustLoan } from './adjustLoan.js'

import { prependPendingPeerMessage } from './index.js'

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
  let { loanBalance } = state

  const adjustedItemValue = isItemSoldInShop(item)
    ? getResaleValue(item)
    : getAdjustedItemValue(valueAdjustments, id)

  const saleIsGarnished = isItemAFarmProduct(item)
  let saleValue = 0,
    experienceGained = 0,
    salePriceMultiplier = 1

  for (let i = 0; i < howMany; i++) {
    const loanGarnishment = saleIsGarnished
      ? Math.min(
          loanBalance,
          castToMoney(adjustedItemValue * LOAN_GARNISHMENT_RATE)
        )
      : 0

    if (isItemAFarmProduct(item)) {
      salePriceMultiplier = getSalePriceMultiplier(completedAchievements)
      experienceGained += EXPERIENCE_VALUES.ITEM_SOLD
    }

    const garnishedProfit =
      adjustedItemValue * salePriceMultiplier - loanGarnishment

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

  state = addExperience(state, experienceGained)

  state = {
    ...state,
    itemsSold: newItemsSold,
  }

  state = decrementItemFromInventory(state, id, howMany)

  state = prependPendingPeerMessage(
    state,
    SOLD_ITEM_PEER_NOTIFICATION('', howMany, item),
    'warning'
  )

  return updateLearnedRecipes(state)
}
