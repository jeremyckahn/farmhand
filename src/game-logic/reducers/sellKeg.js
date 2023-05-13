/** @typedef {import("../../index").farmhand.item} item */
/** @typedef {import("../../index").farmhand.keg} keg */
/** @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state */

import { itemsMap } from '../../data/maps'
import {
  castToMoney,
  farmProductsSold,
  getAdjustedItemValue,
  getSalePriceMultiplier,
  levelAchieved,
  moneyTotal,
} from '../../utils'
import { LOAN_GARNISHMENT_RATE } from '../../constants'
import { SOLD_ITEM_PEER_NOTIFICATION } from '../../templates'

import { processLevelUp } from './processLevelUp'
import { addRevenue } from './addRevenue'
import { updateLearnedRecipes } from './updateLearnedRecipes'
import { adjustLoan } from './adjustLoan'
import { removeKegFromCellar } from './removeKegFromCellar'

import { prependPendingPeerMessage } from './index'

/**
 * @param {state} state
 * @param {keg} keg
 * @param {number} [howMany=1]
 * @returns {state}
 */
export const sellKeg = (state, keg, howMany = 1) => {
  if (howMany === 0) {
    return state
  }

  const { itemId } = keg
  const item = itemsMap[itemId]
  const {
    completedAchievements,
    itemsSold,
    money: initialMoney,
    valueAdjustments,
  } = state
  const oldLevel = levelAchieved(farmProductsSold(itemsSold))
  let { loanBalance } = state

  let saleValue = 0

  for (let i = 0; i < howMany; i++) {
    // FIXME: Calculate fermented item value here
    const adjustedItemValue = getAdjustedItemValue(valueAdjustments, itemId)

    const loanGarnishment = Math.min(
      loanBalance,
      castToMoney(adjustedItemValue * LOAN_GARNISHMENT_RATE)
    )

    const salePriceMultiplier = getSalePriceMultiplier(completedAchievements)

    const garnishedProfit =
      adjustedItemValue * salePriceMultiplier - loanGarnishment

    loanBalance = moneyTotal(loanBalance, -loanGarnishment)
    saleValue = moneyTotal(saleValue, garnishedProfit)
  }

  state = adjustLoan(state, moneyTotal(loanBalance, -state.loanBalance))

  // NOTE: This logic will need to be revisited to support Wine sales. Wines as
  // items should be treated distinctly from their originating Grape items.
  const newItemsSold = {
    ...itemsSold,
    [itemId]: (itemsSold[itemId] ?? 0) + howMany,
  }

  // money needs to be passed in explicitly here because state.money gets
  // mutated above and addRevenue needs its initial value.
  state = addRevenue({ ...state, money: initialMoney }, saleValue)

  state = {
    ...state,
    itemsSold: newItemsSold,
  }

  state = processLevelUp(state, oldLevel)
  state = removeKegFromCellar(state, keg.id)

  // FIXME: Display kegged item name, not base item
  state = prependPendingPeerMessage(
    state,
    SOLD_ITEM_PEER_NOTIFICATION`${howMany}${item}`,
    'warning'
  )

  state = updateLearnedRecipes(state)

  return state
}
