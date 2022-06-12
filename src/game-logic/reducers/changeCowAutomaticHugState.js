import { itemsMap } from '../../data/maps'
import { areHuggingMachinesInInventory } from '../../utils'
import { HUGGING_MACHINE_ITEM_ID } from '../../constants'

import { addItemToInventory } from './addItemToInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'
import { modifyCow } from './modifyCow'

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
