import { levelAchieved } from '../../utils/levelAchieved.ts'
import {
  filterItemIdsToSeeds,
  getPriceEventForCrop,
  getRandomUnlockedCrop,
} from '../../utils/index.tsx'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements.ts'
import { PRICE_EVENT_CHANCE } from '../../constants.ts'
import { PRICE_CRASH, PRICE_SURGE } from '../../templates.ts'
import { random } from '../../common/utils.ts'

import { createPriceEvent } from './createPriceEvent.ts'

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
