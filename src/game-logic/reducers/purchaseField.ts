import { moneyTotal, nullArray } from '../../utils/index.tsx'
import { EXPERIENCE_VALUES, PURCHASEABLE_FIELD_SIZES } from '../../constants.ts'

import { addExperience } from './addExperience.ts'

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
    field: nullArray(rows).map((_, rowIndex) =>
      nullArray(columns).map(
        (__, columnIdx) =>
          (field[rowIndex] && field[rowIndex][columnIdx]) || null
      )
    ),
    money: moneyTotal(money, -price),
  }
}
