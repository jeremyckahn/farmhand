import { moneyTotal, nullArray } from '../../utils/index.js'
import { EXPERIENCE_VALUES, PURCHASEABLE_FIELD_SIZES } from '../../constants.js'

import { addExperience } from './addExperience.js'

/**
 * @param {farmhand.state} state
 * @param {number} fieldId
 * @returns {farmhand.state}
 */
export const purchaseField = (state, fieldId) => {
  const { field, money, purchasedField } = state
  if (purchasedField >= fieldId) {
    return state
  }

  state = addExperience(state, EXPERIENCE_VALUES.FIELD_EXPANDED)

  const fieldSize = PURCHASEABLE_FIELD_SIZES.get(fieldId)
  if (!fieldSize) {
    return state
  }
  const { columns, price, rows } = fieldSize

  return {
    ...state,
    purchasedField: fieldId,
    field: nullArray(rows).map((_, row) =>
      nullArray(columns).map(
        (_, column) => (field[row] && field[row][column]) || null
      )
    ),
    money: moneyTotal(money, -price),
  }
}
