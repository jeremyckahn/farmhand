import { moneyTotal, nullArray } from '../../utils'
import { EXPERIENCE_VALUES, PURCHASEABLE_FIELD_SIZES } from '../../constants'

import { addExperience } from './addExperience'

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

  const { columns, price, rows } = PURCHASEABLE_FIELD_SIZES.get(fieldId)

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
