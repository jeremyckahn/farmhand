import { fertilizerType } from '../../enums.js'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap.js'
import {
  RAIN_MESSAGE,
  STORM_MESSAGE,
  STORM_DESTROYS_SCARECROWS_MESSAGE,
} from '../../strings.js'
import { shouldStormToday } from '../../utils/index.js'

import {
  fieldHasScarecrow,
  plotContainsScarecrow,
  updateField,
} from './helpers.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { waterField } from './waterField.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyPrecipitation = state => {
  let { field } = state
  let scarecrowsConsumedByReplanting = 0
  let notification

  if (shouldStormToday()) {
    if (fieldHasScarecrow(field)) {
      notification = /** @type {farmhand.notification} */ ({
        message: STORM_DESTROYS_SCARECROWS_MESSAGE,
        severity: 'error',
      })

      let { scarecrow: scarecrowsInInventory = 0 } = getInventoryQuantityMap(
        state.inventory
      )

      field = updateField(field, plot => {
        if (!plotContainsScarecrow(plot)) {
          return plot
        }

        if (
          scarecrowsInInventory &&
          plot &&
          plot.fertilizerType === fertilizerType.RAINBOW
        ) {
          scarecrowsInInventory--
          scarecrowsConsumedByReplanting++

          return plot
        }

        return null
      })
    } else {
      notification = /** @type {farmhand.notification} */ ({
        message: STORM_MESSAGE,
        severity: 'info',
      })
    }
  } else {
    notification = /** @type {farmhand.notification} */ ({
      message: RAIN_MESSAGE,
      severity: 'info',
    })
  }

  state = decrementItemFromInventory(
    { ...state, field },
    'scarecrow',
    scarecrowsConsumedByReplanting
  )

  state = {
    ...state,
    newDayNotifications: [...state.newDayNotifications, notification],
  }

  state = waterField(state)

  return state
}
