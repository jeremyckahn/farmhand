/**
 * @param priceEventKey Either 'priceCrashes' or 'priceSurges'
 */
export const createPriceEvent = (
  state: farmhand.state,
  priceEvent: farmhand.priceEvent,
  priceEventKey: 'priceCrashes' | 'priceSurges'
): farmhand.state => ({
  ...state,
  [priceEventKey]: {
    ...state[priceEventKey],
    [priceEvent.itemId]: priceEvent,
  },
})
