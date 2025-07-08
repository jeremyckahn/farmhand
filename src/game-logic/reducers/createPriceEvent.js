/**
 * @param {farmhand.state} state
 * @param {farmhand.priceEvent} priceEvent
 * @param {string} priceEventKey Either 'priceCrashes' or 'priceSurges'
 * @returns {farmhand.state}
 */
export const createPriceEvent = (state, priceEvent, priceEventKey) => ({
  ...state,
  [priceEventKey]: {
    ...state[priceEventKey],
    [priceEvent.itemId]: priceEvent,
  },
})
