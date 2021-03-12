import { itemsMap } from '../src/data/maps'

export const MARKET_SUMMARY_FOR_DISCORD = (_, room, valueAdjustments) => {
  let string = `Current market values for the **${room}** room:\n`

  Object.keys(valueAdjustments).forEach(itemId => {
    const item = itemsMap[itemId]
    string += `  - **${item.name}**: $${(
      valueAdjustments[itemId] * item.value
    ).toFixed(2)}\n`
  })

  return string
}
