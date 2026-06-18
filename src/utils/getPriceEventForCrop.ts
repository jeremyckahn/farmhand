import { PRICE_EVENT_STANDARD_DURATION_DECREASE } from '../constants.js'

import { getCropLifecycleDuration } from './getCropLifecycleDuration.js'

export const getPriceEventForCrop = (
  cropItem: farmhand.item
): farmhand.priceEvent => ({
  itemId: cropItem.id,
  daysRemaining:
    getCropLifecycleDuration(cropItem as any) -
    PRICE_EVENT_STANDARD_DURATION_DECREASE,
})
