import { itemsMap } from '../../data/maps'
import { HUGGING_MACHINE_ITEM_ID } from '../../constants'

import { addItemToInventory } from './addItemToInventory'

import { changeCowBreedingPenResident } from './changeCowBreedingPenResident'

// TODO: Add tests for this reducer
/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const removeCowFromInventory = (state, cow) => {
  const cowInventory = [...state.cowInventory]
  const { isUsingHuggingMachine } = cow

  cowInventory.splice(cowInventory.indexOf(cow), 1)

  if (isUsingHuggingMachine) {
    state = addItemToInventory(state, itemsMap[HUGGING_MACHINE_ITEM_ID])
  }

  state = changeCowBreedingPenResident(state, cow, false)

  return { ...state, cowInventory }
}
