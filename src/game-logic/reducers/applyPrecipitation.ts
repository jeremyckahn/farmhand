import { fertilizerType } from '../../enums.ts'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap.ts'
import {
  RAIN_MESSAGE,
  STORM_MESSAGE,
  STORM_DESTROYS_SCARECROWS_MESSAGE,
} from '../../strings.ts'
import { shouldStormToday } from '../../utils/index.tsx'

import {
  fieldHasScarecrow,
  plotContainsScarecrow,
  updateField,
} from './helpers.tsx'
import { decrementItemFromInventory } from './decrementItemFromInventory.ts'
import { waterField } from './waterField.ts'

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
      notification = /** @type {farmhand.notification} */ {
        message: STORM_DESTROYS_SCARECROWS_MESSAGE,
        severity: 'error',
      }

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
      notification = /** @type {farmhand.notification} */ {
        message: STORM_MESSAGE,
        severity: 'info',
      }
    }
  } else {
    notification = /** @type {farmhand.notification} */ {
      message: RAIN_MESSAGE,
      severity: 'info',
    }
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
