import { moneyTotal } from '../../utils/index.tsx'
import { EXPERIENCE_VALUES, PURCHASEABLE_CELLARS } from '../../constants.ts'

import { CELLAR_PURCHASED } from '../../templates.ts'

import { addExperience } from './addExperience.ts'
import { showNotification } from './showNotification.ts'

/**
 * @param {farmhand.state} state
 * @param {number} cellarId
 * @returns {farmhand.state}
 */
export const purchaseCellar = (state, cellarId) => {
  const { money, purchasedCellar } = state

  if (purchasedCellar >= cellarId) {
    return state
  }

  const cellarData = PURCHASEABLE_CELLARS.get(cellarId)

  if (!cellarData) {
    return state
  }

  const { price, space } = cellarData

  state = showNotification(state, CELLAR_PURCHASED('', space), 'success')

  const experienceEarned =
    cellarId > 1
      ? EXPERIENCE_VALUES.CELLAR_EXPANDED
      : EXPERIENCE_VALUES.CELLAR_ACQUIRED
  state = addExperience(state, experienceEarned)

  return {
    ...state,
    purchasedCellar: cellarId,
    money: moneyTotal(money, -price),
  }
}
