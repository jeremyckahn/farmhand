import { itemsMap } from '../../data/maps.ts'
import { areHuggingMachinesInInventory } from '../../utils/index.tsx'
import { HUGGING_MACHINE_ITEM_ID } from '../../constants.ts'

import { addItemToInventory } from './addItemToInventory.ts'
import { decrementItemFromInventory } from './decrementItemFromInventory.ts'
import { modifyCow } from './modifyCow.ts'

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @param {boolean} doUseHuggingMachine
 * @returns {farmhand.state}
 */
export const changeCowAutomaticHugState = (state, cow, doUseHuggingMachine) => {
  if (doUseHuggingMachine) {
    if (
      cow.isUsingHuggingMachine ||
      !areHuggingMachinesInInventory(state.inventory)
    ) {
      return state
    }
  }

  state = modifyCow(state, cow.id, updatedCow => ({
    ...updatedCow,
    isUsingHuggingMachine: doUseHuggingMachine,
  }))

  state = doUseHuggingMachine
    ? decrementItemFromInventory(state, HUGGING_MACHINE_ITEM_ID)
    : addItemToInventory(state, itemsMap[HUGGING_MACHINE_ITEM_ID])

  return state
}
