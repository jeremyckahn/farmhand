import { itemsMap } from '../../data/maps.ts'
import {
  castToMoney,
  getSalePriceMultiplier,
  moneyTotal,
} from '../../utils/index.tsx'
import { EXPERIENCE_VALUES, LOAN_GARNISHMENT_RATE } from '../../constants.ts'
import { SOLD_FERMENTED_ITEM_PEER_NOTIFICATION } from '../../templates.ts'
import { getKegValue } from '../../utils/getKegValue.ts'

import { addExperience } from './addExperience.ts'
import { addRevenue } from './addRevenue.ts'
import { adjustLoan } from './adjustLoan.ts'
import { removeKegFromCellar } from './removeKegFromCellar.ts'
import { updateLearnedRecipes } from './updateLearnedRecipes.ts'

import { prependPendingPeerMessage } from './index.ts'

/**
 * @param {farmhand.state} state
 * @param {farmhand.keg} keg
 * @returns {farmhand.state}
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
    SOLD_FERMENTED_ITEM_PEER_NOTIFICATION`${item}`,
    'warning'
  )

  state = updateLearnedRecipes(state)

  return state
}
