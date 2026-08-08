import { fertilizerType } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
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
import { waterField } from './waterField.js'

export const applyPrecipitation = (state: farmhand.state): farmhand.state => {
  let { field } = state
  let scarecrowsConsumedByReplanting = 0
  let notification: farmhand.notification
  let destroyedLightningRodItems: farmhand.item[] = []
  let lightningRodItemIdsConsumedByReplanting: string[] = []

  if (shouldStormToday()) {
    if (fieldHasLightningRod(field)) {
      // Every placed Lightning Rod intercepts the strike that would
      // otherwise destroy a Scarecrow (see the branch below), absorbing
      // the damage itself instead. A storm strikes every rod on the
      // field at once, not just one of them.
      const rodsAvailableForReplanting: Record<string, number> = {
        ...getInventoryQuantityMap(state.inventory),
      }

      let anyRodWasDestroyed = false
      let anyRodWasReplanted = false

      field = updateField(field, plot => {
        if (!plot || !plotContainsLightningRod(plot)) {
          return plot
        }

        const item = itemsMap[plot.itemId]
        const strikesSustained = (plot.lightningStrikesSustained ?? 0) + 1

        if (strikesSustained >= (item.lightningStrikeCapacity ?? Infinity)) {
          const spareRodsAvailable =
            rodsAvailableForReplanting[plot.itemId] || 0

          // Same escape hatch Rainbow Fertilizer gives Scarecrows: a spare
          // rod of the same tier in inventory instantly replaces the one
          // that would've been destroyed, resetting its strike count. The
          // spare pool is shared and decremented across every rod struck
          // this storm, not re-read fresh per rod.
          if (
            plot.fertilizerType === fertilizerType.RAINBOW &&
            spareRodsAvailable > 0
          ) {
            rodsAvailableForReplanting[plot.itemId] = spareRodsAvailable - 1
            lightningRodItemIdsConsumedByReplanting.push(plot.itemId)
            anyRodWasReplanted = true

            return { ...plot, lightningStrikesSustained: 0 }
          }

          anyRodWasDestroyed = true
          destroyedLightningRodItems.push(item)

          return null
        }

        return { ...plot, lightningStrikesSustained: strikesSustained }
      })

      notification = {
        message: anyRodWasDestroyed
          ? LIGHTNING_ROD_DESTROYED_MESSAGE
          : anyRodWasReplanted
          ? LIGHTNING_ROD_REPLANTED_MESSAGE
          : LIGHTNING_ROD_STRUCK_MESSAGE,
        severity: anyRodWasDestroyed
          ? 'error'
          : anyRodWasReplanted
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

  for (const itemId of lightningRodItemIdsConsumedByReplanting) {
    state = decrementItemFromInventory(state, itemId)
  }

  for (const item of destroyedLightningRodItems) {
    state = applyDestructionYield(state, item)
  }

  state = {
    ...state,
    newDayNotifications: [...state.newDayNotifications, notification],
  }

  state = waterField(state)

  return state
}
