import { itemsMap } from '../../data/maps.js'
import { wineService } from '../../services/wine.js'
import { KEGS_READY_TO_SELL } from '../../templates.js'
import { getKegDisplayName } from '../../utils/getKegDisplayName.js'

import { processCellarSpoilage } from './processCellarSpoilage.js'

/**
 * @returns state
 */
export const processCellar = (state: farmhand.state) => {
  state = processCellarSpoilage(state)
  const { cellarInventory } = state

  const newCellarInventory = [...cellarInventory]
  const kegsReady: Record<string, number> = {}

  for (let i = 0; i < newCellarInventory.length; i++) {
    const keg = newCellarInventory[i]
    const daysUntilMature = keg.daysUntilMature - 1
    const item = itemsMap[keg.itemId]

    // Only wine is worth calling out here - it's a deliberate long-term
    // investment (kegs that never spoil and appreciate in value). Generic
    // fermented crops still spoil if left too long, so their own spoilage
    // notification already covers that urgency without needing a separate
    // "ready" notification too.
    const isNotifiableKeg = wineService.isWineRecipe(item)

    if (isNotifiableKeg && keg.daysUntilMature > 0 && daysUntilMature <= 0) {
      const displayName = getKegDisplayName(item)

      kegsReady[displayName] = (kegsReady[displayName] || 0) + 1
    }

    newCellarInventory[i] = {
      ...keg,
      daysUntilMature,
    }
  }

  const newDayNotifications = [...state.newDayNotifications]

  if (Object.keys(kegsReady).length) {
    newDayNotifications.push({
      message: KEGS_READY_TO_SELL('', kegsReady),
      severity: 'success',
    })
  }

  state = { ...state, cellarInventory: newCellarInventory, newDayNotifications }

  return state
}
