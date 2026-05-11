/**
 * @param priceEventKey Either 'priceCrashes' or 'priceSurges'
 */
export const createPriceEvent = (
  state: farmhand.state,
  priceEvent: farmhand.priceEvent,
  priceEventKey: string
): farmhand.state => ({
  ...state,
  [priceEventKey]: {
    ...state[priceEventKey],
    [priceEvent.itemId]: priceEvent,
  },
})
