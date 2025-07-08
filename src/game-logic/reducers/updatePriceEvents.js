/**
 * @param {Record<string, farmhand.priceEvent>} priceEvents
 * @returns {Record<string, farmhand.priceEvent>}
 */
const decrementPriceEventDays = priceEvents =>
  Object.keys(priceEvents).reduce((acc, key) => {
    const { itemId, daysRemaining } = priceEvents[key]

    if (daysRemaining > 1) {
      acc[key] = { itemId, daysRemaining: daysRemaining - 1 }
    }

    return acc
  }, {})

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */

export const updatePriceEvents = state => {
  const { priceCrashes, priceSurges } = state

  return {
    ...state,
    priceCrashes: decrementPriceEventDays(priceCrashes),
    priceSurges: decrementPriceEventDays(priceSurges),
  }
}
