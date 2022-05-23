/**
 * @param {farmhand.state} state
 * @param {farmhand.priceEvent} priceEvent
 * @param {string} priceEventKey Either 'priceCrashes' or 'priceSurges'
 * @returns {farmhand.state}
 */
export const createPriceEvent = (state, priceEvent, priceEventKey) => ({
  [priceEventKey]: {
    ...state[priceEventKey],
    [priceEvent.itemId]: priceEvent,
  },
})
