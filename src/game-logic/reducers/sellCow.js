import { getCowColorId, getCowValue } from '../../utils'

import { addRevenue } from './addRevenue'

import { removeCowFromInventory } from './removeCowFromInventory'

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
