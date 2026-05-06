/**


 * @param priceEventKey Either 'priceCrashes' or 'priceSurges'

 */
export const createPriceEvent = (state: any, priceEvent: any, priceEventKey: string): any => ({
  ...state,
  [priceEventKey]: {
    ...state[priceEventKey],
    [priceEvent.itemId]: priceEvent,
  },
})
