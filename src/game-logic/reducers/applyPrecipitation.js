import { fertilizerType } from '../../enums'
import { getInventoryQuantityMap } from '../../utils'
import { STORM_CHANCE } from '../../constants'
import {
  RAIN_MESSAGE,
  STORM_MESSAGE,
  STORM_DESTROYS_SCARECROWS_MESSAGE,
} from '../../strings'

import {
  fieldHasScarecrow,
  plotContainsScarecrow,
  updateField,
} from './helpers'
import { decrementItemFromInventory } from './decrementItemFromInventory'
import { waterField } from './field'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyPrecipitation = state => {
  let { field } = state
  let scarecrowsConsumedByReplanting = 0
  let notification

  if (Math.random() < STORM_CHANCE) {
    if (fieldHasScarecrow(field)) {
      notification = {
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
          plot.fertilizerType === fertilizerType.RAINBOW
        ) {
          scarecrowsInInventory--
          scarecrowsConsumedByReplanting++

          return plot
        }

        return null
      })
    } else {
      notification = { message: STORM_MESSAGE, severity: 'info' }
    }
  } else {
    notification = { message: RAIN_MESSAGE, severity: 'info' }
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
