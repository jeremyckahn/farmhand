import {
  farmProductsSold,
  filterItemIdsToSeeds,
  getLevelEntitlements,
  getPriceEventForCrop,
  getRandomUnlockedCrop,
  levelAchieved,
} from '../../utils'
import { PRICE_EVENT_CHANCE } from '../../constants'
import { PRICE_CRASH, PRICE_SURGE } from '../../templates'

import { createPriceEvent } from './createPriceEvent'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const generatePriceEvents = state => {
  const priceCrashes = { ...state.priceCrashes }
  const priceSurges = { ...state.priceSurges }
  let newDayNotifications = [...state.newDayNotifications]
  let priceEvent

  if (Math.random() < PRICE_EVENT_CHANCE) {
    const { items: unlockedItems } = getLevelEntitlements(
      levelAchieved(farmProductsSold(state.itemsSold))
    )

    const cropItem = getRandomUnlockedCrop(
      filterItemIdsToSeeds(Object.keys(unlockedItems))
    )
    const { id } = cropItem

    // Only create a priceEvent if one does not already exist
    if (!priceCrashes[id] && !priceSurges[id]) {
      const priceEventType =
        Math.random() < 0.5 ? 'priceCrashes' : 'priceSurges'

      priceEvent = createPriceEvent(
        state,
        getPriceEventForCrop(cropItem),
        priceEventType
      )

      newDayNotifications.push(
        priceEventType === 'priceCrashes'
          ? {
              message: PRICE_CRASH`${cropItem}`,
              severity: 'warning',
            }
          : {
              message: PRICE_SURGE`${cropItem}`,
              severity: 'success',
            }
      )
    }
  }

  return { ...state, ...priceEvent, newDayNotifications }
}