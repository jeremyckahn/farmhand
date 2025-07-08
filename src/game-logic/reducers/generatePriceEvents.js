import { levelAchieved } from '../../utils/levelAchieved.js'
import {
  filterItemIdsToSeeds,
  getPriceEventForCrop,
  getRandomUnlockedCrop,
} from '../../utils/index.js'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements.js'
import { PRICE_EVENT_CHANCE } from '../../constants.js'
import { PRICE_CRASH, PRICE_SURGE } from '../../templates.js'
import { random } from '../../common/utils.js'

import { createPriceEvent } from './createPriceEvent.js'

const TYPE_CRASH = 'priceCrashes'
const TYPE_SURGE = 'priceSurges'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const generatePriceEvents = state => {
  const priceCrashes = { ...state.priceCrashes }
  const priceSurges = { ...state.priceSurges }
  let newDayNotifications = [...state.newDayNotifications]
  let priceEvent

  // TODO: Use isRandomNumberLessThan here once it supports an exclusive
  // less-than check.
  if (random() < PRICE_EVENT_CHANCE) {
    const { items: unlockedItems } = getLevelEntitlements(
      levelAchieved(state.experience)
    )

    const cropItem = getRandomUnlockedCrop(
      filterItemIdsToSeeds(Object.keys(unlockedItems))
    )
    const { id } = cropItem

    const doesPriceEventAlreadyExist = Boolean(
      priceCrashes[id] || priceSurges[id]
    )

    if (!doesPriceEventAlreadyExist) {
      const priceEventType = random() < 0.5 ? TYPE_CRASH : TYPE_SURGE

      priceEvent = createPriceEvent(
        state,
        getPriceEventForCrop(cropItem),
        priceEventType
      )

      newDayNotifications.push(
        priceEventType === TYPE_CRASH
          ? {
              message: PRICE_CRASH('', cropItem),
              severity: 'warning',
            }
          : {
              message: PRICE_SURGE('', cropItem),
              severity: 'success',
            }
      )
    }
  }

  return { ...state, ...priceEvent, newDayNotifications }
}
