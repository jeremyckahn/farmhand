import { moneyTotal } from '../../utils/index.tsx'
import { EXPERIENCE_VALUES, PURCHASEABLE_COW_PENS } from '../../constants.ts'
import { COW_PEN_PURCHASED } from '../../templates.ts'

import { addExperience } from './addExperience.ts'
import { showNotification } from './showNotification.ts'

/**
 * @param {farmhand.state} state
 * @param {number} cowPenId
 * @returns {farmhand.state}
 */
export const purchaseCowPen = (state, cowPenId) => {
  const { money, purchasedCowPen } = state

  if (purchasedCowPen >= cowPenId) {
    return state
  }

  const cowPenData = PURCHASEABLE_COW_PENS.get(cowPenId)

  if (!cowPenData) {
    return state
  }

  const { cows, price } = cowPenData

  state = showNotification(state, COW_PEN_PURCHASED('', cows), 'success')

  const experienceEarned =
    cowPenId > 1
      ? EXPERIENCE_VALUES.COW_PEN_EXPANDED
      : EXPERIENCE_VALUES.COW_PEN_ACQUIRED
  state = addExperience(state, experienceEarned)

  return {
    ...state,
    purchasedCowPen: cowPenId,
    money: moneyTotal(money, -price),
  }
}
