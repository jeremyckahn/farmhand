import { moneyTotal } from '../../utils'
import { EXPERIENCE_VALUES, PURCHASEABLE_CELLARS } from '../../constants'

import { CELLAR_PURCHASED } from '../../templates'

import { addExperience } from './addExperience'
import { showNotification } from './showNotification'

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

  const { price, space } = PURCHASEABLE_CELLARS.get(cellarId)

  state = showNotification(state, CELLAR_PURCHASED`${space}`, 'success')

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
