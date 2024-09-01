import { itemsMap } from '../../data/maps.js'
import { areHuggingMachinesInInventory } from '../../utils/index.js'
import { HUGGING_MACHINE_ITEM_ID } from '../../constants.js'

import { addItemToInventory } from './addItemToInventory.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { modifyCow } from './modifyCow.js'

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

  state = modifyCow(state, cow.id, cow => ({
    ...cow,
    isUsingHuggingMachine: doUseHuggingMachine,
  }))

  state = doUseHuggingMachine
    ? decrementItemFromInventory(state, HUGGING_MACHINE_ITEM_ID)
    : addItemToInventory(state, itemsMap[HUGGING_MACHINE_ITEM_ID])

  return state
}
