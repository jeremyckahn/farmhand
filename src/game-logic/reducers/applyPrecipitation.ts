import { fertilizerType } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import { random } from '../../common/utils.js'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap.js'
import {
  RAIN_MESSAGE,
  STORM_MESSAGE,
  STORM_DESTROYS_SCARECROWS_MESSAGE,
  LIGHTNING_ROD_STRUCK_MESSAGE,
  LIGHTNING_ROD_DESTROYED_MESSAGE,
} from '../../strings.js'
import { shouldStormToday } from '../../utils/shouldStormToday.js'

import {
  fieldHasLightningRod,
  fieldHasScarecrow,
  plotContainsLightningRod,
  plotContainsScarecrow,
  updateField,
} from './helpers.js'
import { addItemToInventory } from './addItemToInventory.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { forEachPlot } from './applyCrows.js'
import { waterField } from './waterField.js'

export const applyPrecipitation = (state: farmhand.state): farmhand.state => {
  let { field } = state
  let scarecrowsConsumedByReplanting = 0
  let notification: farmhand.notification
  let lightningRodOreRefund: { itemId: string; quantity: number } | null = null

  if (shouldStormToday()) {
    if (fieldHasLightningRod(field)) {
      // A placed Lightning Rod intercepts the strike that would otherwise
      // destroy a Scarecrow (see the branch below), absorbing the damage
      // itself instead. A storm is a single daily event - it delivers one
      // strike total, randomly targeting one of the placed rods (matching
      // how applyCrows.ts picks a random plot to target).
      const lightningRodCoords: Array<{ x: number; y: number }> = []

      forEachPlot(state, (plot, x, y) => {
        if (plotContainsLightningRod(plot)) {
          lightningRodCoords.push({ x, y })
        }
      })

      const { x: strikeX, y: strikeY } = lightningRodCoords[
        Math.floor(random() * lightningRodCoords.length)
      ]

      let lightningRodWasDestroyed = false

      field = updateField(field, (plot, x, y) => {
        if (x !== strikeX || y !== strikeY || !plot) {
          return plot
        }

        const item = itemsMap[plot.itemId]
        const strikesSustained = (plot.lightningStrikesSustained ?? 0) + 1

        if (strikesSustained >= (item.lightningStrikeCapacity ?? Infinity)) {
          lightningRodWasDestroyed = true
          lightningRodOreRefund = item.destructionOreRefund ?? null

          return null
        }

        return { ...plot, lightningStrikesSustained: strikesSustained }
      })

      notification = {
        message: lightningRodWasDestroyed
          ? LIGHTNING_ROD_DESTROYED_MESSAGE
          : LIGHTNING_ROD_STRUCK_MESSAGE,
        severity: lightningRodWasDestroyed ? 'error' : 'info',
      }
    } else if (fieldHasScarecrow(field)) {
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
      notification = {
        message: STORM_MESSAGE,
        severity: 'info',
      }
    }
  } else {
    notification = {
      message: RAIN_MESSAGE,
      severity: 'info',
    }
  }

  state = decrementItemFromInventory(
    { ...state, field },
    'scarecrow',
    scarecrowsConsumedByReplanting
  )

  if (lightningRodOreRefund) {
    const { itemId, quantity } = lightningRodOreRefund

    state = addItemToInventory(state, itemsMap[itemId], quantity)
  }

  state = {
    ...state,
    newDayNotifications: [...state.newDayNotifications, notification],
  }

  state = waterField(state)

  return state
}
