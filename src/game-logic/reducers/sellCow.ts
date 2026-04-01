import { getCowColorId, getCowValue } from '../../utils/index.js'

import { addRevenue } from './addRevenue.js'

import { removeCowFromInventory } from './removeCowFromInventory.js'

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const sellCow = (state, cow) => {
  const { cowsSold } = state
  const cowColorId = getCowColorId(cow)
  const cowValue = getCowValue(cow, true)

  state = removeCowFromInventory(state, cow)
  state = addRevenue(state, cowValue)

  const newCowsSold = {
    ...cowsSold,
    [cowColorId]: (cowsSold[cowColorId] || 0) + 1,
  }

  state = { ...state, cowsSold: newCowsSold }

  return state
}
