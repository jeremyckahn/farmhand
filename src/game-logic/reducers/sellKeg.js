/**
 * @typedef {import("../../index").farmhand.item} item
 * @typedef {import("../../index").farmhand.keg} keg
 * @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state
 */

import { itemsMap } from '../../data/maps.js'
import {
  castToMoney,
  getSalePriceMultiplier,
  moneyTotal,
} from '../../utils/index.js'
import { EXPERIENCE_VALUES, LOAN_GARNISHMENT_RATE } from '../../constants.js'
import { SOLD_FERMENTED_ITEM_PEER_NOTIFICATION } from '../../templates.js'
import { getKegValue } from '../../utils/getKegValue.js'

import { addExperience } from './addExperience.js'
import { addRevenue } from './addRevenue.js'
import { adjustLoan } from './adjustLoan.js'
import { removeKegFromCellar } from './removeKegFromCellar.js'
import { updateLearnedRecipes } from './updateLearnedRecipes.js'

import { prependPendingPeerMessage } from './index.js'

/**
 * @param {state} state
 * @param {keg} keg
 * @returns {state}
 */
export const sellKeg = (state, keg) => {
  const { itemId } = keg
  const item = itemsMap[itemId]
  const {
    cellarItemsSold,
    completedAchievements,
    itemsSold,
    money: initialMoney,
  } = state

  let { loanBalance } = state
  let saleValue = 0

  const kegValue = getKegValue(keg)

  const loanGarnishment = Math.min(
    loanBalance,
    castToMoney(kegValue * LOAN_GARNISHMENT_RATE)
  )

  const salePriceMultiplier = getSalePriceMultiplier(completedAchievements)

  const garnishedProfit = kegValue * salePriceMultiplier - loanGarnishment

  loanBalance = moneyTotal(loanBalance, -loanGarnishment)
  saleValue = moneyTotal(saleValue, garnishedProfit)

  state = adjustLoan(state, moneyTotal(loanBalance, -state.loanBalance))

  // NOTE: This logic will need to be revisited to support Wine sales. Wines as
  // items should be treated distinctly from their originating Grape items.
  const newItemsSold = {
    ...itemsSold,
    [itemId]: (itemsSold[itemId] ?? 0) + 1,
  }
  const newCellarItemsSold = {
    ...cellarItemsSold,
    [itemId]: (cellarItemsSold[itemId] ?? 0) + 1,
  }

  state = {
    ...state,
    itemsSold: newItemsSold,
    cellarItemsSold: newCellarItemsSold,
  }

  // money needs to be passed in explicitly here because state.money gets
  // mutated above and addRevenue needs its initial value.
  state = addRevenue({ ...state, money: initialMoney }, saleValue)
  state = addExperience(state, EXPERIENCE_VALUES.KEG_SOLD)
  state = removeKegFromCellar(state, keg.id)

  // NOTE: This notification will need to be revisited to support Wine sales.
  state = prependPendingPeerMessage(
    state,
    // @ts-expect-error
    SOLD_FERMENTED_ITEM_PEER_NOTIFICATION`${item}`,
    'warning'
  )

  state = updateLearnedRecipes(state)

  return state
}
