import { moneyTotal, nullArray } from '../../utils/index.tsx'
import { EXPERIENCE_VALUES, PURCHASABLE_FOREST_SIZES } from '../../constants.ts'
import { FOREST_EXPANDED } from '../../templates.ts'
import { FOREST_AVAILABLE_NOTIFICATION } from '../../strings.ts'

import { addExperience } from './addExperience.ts'
import { showNotification } from './showNotification.ts'

/**
 * @param {farmhand.state} state
 * @param {number} forestId
 * @returns {farmhand.state}
 */
export const purchaseForest = (state, forestId) => {
  const { forest, money, purchasedForest } = state
  if (purchasedForest >= forestId) {
    return state
  }

  state = addExperience(state, EXPERIENCE_VALUES.FOREST_EXPANDED)

  const forestSize = PURCHASABLE_FOREST_SIZES.get(forestId)
  if (!forestSize) {
    return state
  }
  const { columns, price, rows } = forestSize

  /*
   * TODO: using FOREST_AVAILABLE_NOTIFICATION here is temporary, this code path will
   * ultimately just be for expansion and availability will happen elsewhere, such as
   * through leveling up to a certain level
   */
  const notificationText =
    forestId === 1
      ? FOREST_AVAILABLE_NOTIFICATION
      : FOREST_EXPANDED`${rows * columns}`
  state = showNotification(state, notificationText, 'success')

  return {
    ...state,
    purchasedForest: forestId,
    forest: nullArray(rows).map((_, rowIndex) =>
      nullArray(columns).map(
        (__, columnIdx) =>
          (forest[rowIndex] && forest[rowIndex][columnIdx]) || null
      )
    ),
    money: moneyTotal(money, -price),
  }
}
