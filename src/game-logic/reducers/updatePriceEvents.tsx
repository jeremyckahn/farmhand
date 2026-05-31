const decrementPriceEventDays = (
  priceEvents: Partial<Record<string, farmhand.priceEvent>>
): Partial<Record<string, farmhand.priceEvent>> =>
  Object.keys(priceEvents).reduce((acc, key) => {
    const priceEvent = priceEvents[key]
    if (!priceEvent) return acc

    const { itemId, daysRemaining } = priceEvent

    if (daysRemaining > 1) {
      acc[key] = { itemId, daysRemaining: daysRemaining - 1 }
    }

    return acc
  }, {})

export const updatePriceEvents = (state: farmhand.state): farmhand.state => {
  const { priceCrashes, priceSurges } = state

  return {
    ...state,
    priceCrashes: decrementPriceEventDays(priceCrashes),
    priceSurges: decrementPriceEventDays(priceSurges),
  }
}
