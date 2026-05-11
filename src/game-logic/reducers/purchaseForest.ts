import { moneyTotal, nullArray } from '../../utils/index.js'
import { EXPERIENCE_VALUES, PURCHASABLE_FOREST_SIZES } from '../../constants.js'
import { FOREST_EXPANDED } from '../../templates.js'
import { FOREST_AVAILABLE_NOTIFICATION } from '../../strings.js'

import { addExperience } from './addExperience.js'
import { showNotification } from './showNotification.js'

export const purchaseForest = (
  state: farmhand.state,
  forestId: number
): farmhand.state => {
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
