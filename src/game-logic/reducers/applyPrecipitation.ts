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
  LIGHTNING_ROD_REPLANTED_MESSAGE,
} from '../../strings.js'
import { shouldStormToday } from '../../utils/shouldStormToday.js'

import {
  applyDestructionYield,
  fieldHasLightningRod,
  fieldHasScarecrow,
  plotContainsLightningRod,
  plotContainsScarecrow,
  updateField,
} from './helpers.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { forEachPlot } from './applyCrows.js'
import { waterField } from './waterField.js'

export const applyPrecipitation = (state: farmhand.state): farmhand.state => {
  let { field } = state
  let scarecrowsConsumedByReplanting = 0
  let notification: farmhand.notification
  let destroyedLightningRodItem: farmhand.item | null = null

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
      let lightningRodItemIdConsumedByReplanting: string | null = null

      field = updateField(field, (plot, x, y) => {
        if (x !== strikeX || y !== strikeY || !plot) {
          return plot
        }

        const item = itemsMap[plot.itemId]
        const strikesSustained = (plot.lightningStrikesSustained ?? 0) + 1

        if (strikesSustained >= (item.lightningStrikeCapacity ?? Infinity)) {
          const rodsInInventory =
            getInventoryQuantityMap(state.inventory)[plot.itemId] || 0

          // Same escape hatch Rainbow Fertilizer gives Scarecrows: a spare
          // rod of the same tier in inventory instantly replaces the one
          // that would've been destroyed, resetting its strike count.
          if (
            plot.fertilizerType === fertilizerType.RAINBOW &&
            rodsInInventory > 0
          ) {
            lightningRodItemIdConsumedByReplanting = plot.itemId

            return { ...plot, lightningStrikesSustained: 0 }
          }

          lightningRodWasDestroyed = true
          destroyedLightningRodItem = item

          return null
        }

        return { ...plot, lightningStrikesSustained: strikesSustained }
      })

      if (lightningRodItemIdConsumedByReplanting) {
        state = decrementItemFromInventory(
          state,
          lightningRodItemIdConsumedByReplanting
        )
      }

      notification = {
        message: lightningRodWasDestroyed
          ? LIGHTNING_ROD_DESTROYED_MESSAGE
          : lightningRodItemIdConsumedByReplanting
          ? LIGHTNING_ROD_REPLANTED_MESSAGE
          : LIGHTNING_ROD_STRUCK_MESSAGE,
        severity: lightningRodWasDestroyed
          ? 'error'
          : lightningRodItemIdConsumedByReplanting
          ? 'success'
          : 'info',
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

  state = applyDestructionYield(state, destroyedLightningRodItem)

  state = {
    ...state,
    newDayNotifications: [...state.newDayNotifications, notification],
  }

  state = waterField(state)

  return state
}
