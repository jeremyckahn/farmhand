import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { getCowFertilizerItem } from '../../utils/getCowFertilizerItem.js'
import { getCowFertilizerProductionRate } from '../../utils/getCowFertilizerProductionRate.js'
import { FERTILIZERS_PRODUCED } from '../../templates.js'

import { addItemToInventory } from './addItemToInventory.js'

export const processCowFertilizerProduction = (
  state: farmhand.state
): farmhand.state => {
  const cowInventory = [...state.cowInventory]
  const newDayNotifications = [...state.newDayNotifications]
  const { length: cowInventoryLength } = cowInventory
  const fertilizersProduced: Record<string, number> = {}
  let hasProducedRainbowFertilizer = state.hasProducedRainbowFertilizer

  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]

    if (
      // `cow.daysSinceProducingFertilizer || 0` is needed because legacy cows
      // did not define daysSinceProducingFertilizer.
      (cow.daysSinceProducingFertilizer || 0) >
      getCowFertilizerProductionRate(cow)
    ) {
      cowInventory[i] = { ...cow, daysSinceProducingFertilizer: 0 }

      const fertilizer = getCowFertilizerItem(cow as any)
      const { name } = fertilizer

      if (!doesInventorySpaceRemain(state)) {
        break
      }

      fertilizersProduced[name] = (fertilizersProduced[name] || 0) + 1
      state = addItemToInventory(state, fertilizer)

      // Sticky - the rainbow-mulch recipe gates on this to confirm the
      // player has ever gotten rainbow-fertilizer at all, since it's rare
      // and would otherwise be spent crafting the very recipe it unlocks.
      if (fertilizer.id === 'rainbow-fertilizer') {
        hasProducedRainbowFertilizer = true
      }
    }
  }

  if (Object.keys(fertilizersProduced).length) {
    newDayNotifications.push({
      message: FERTILIZERS_PRODUCED('', fertilizersProduced),
      severity: 'success',
    })
  }

  return {
    ...state,
    cowInventory,
    hasProducedRainbowFertilizer,
    newDayNotifications,
  }
}
