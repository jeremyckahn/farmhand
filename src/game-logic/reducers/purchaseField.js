import { moneyTotal, nullArray } from '../../utils'
import { PURCHASEABLE_FIELD_SIZES } from '../../constants'

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

  const { columns, price, rows } = PURCHASEABLE_FIELD_SIZES.get(fieldId)

  return {
    purchasedField: fieldId,
    field: nullArray(rows).map((_, row) =>
      nullArray(columns).map(
        (_, column) => (field[row] && field[row][column]) || null
      )
    ),
    money: moneyTotal(money, -price),
  }
}
