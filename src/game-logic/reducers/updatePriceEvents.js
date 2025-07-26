/**
 * @param {Partial<Record<string, farmhand.priceEvent>>} priceEvents
 * @returns {Partial<Record<string, farmhand.priceEvent>>}
 */
const decrementPriceEventDays = priceEvents =>
  Object.keys(priceEvents).reduce((acc, key) => {
    const priceEvent = priceEvents[key]
    if (!priceEvent) return acc

    const { itemId, daysRemaining } = priceEvent

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
