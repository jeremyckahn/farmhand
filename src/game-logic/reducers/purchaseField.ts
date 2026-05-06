import { moneyTotal, nullArray } from '../../utils/index.js'
import { EXPERIENCE_VALUES, PURCHASEABLE_FIELD_SIZES } from '../../constants.js'

import { addExperience } from './addExperience.js'


export const purchaseField = (state: any, fieldId: number): any => {
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
