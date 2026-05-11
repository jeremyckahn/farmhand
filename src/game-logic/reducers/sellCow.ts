import { getCowColorId, getCowValue } from '../../utils/index.js'

import { addRevenue } from './addRevenue.js'

import { removeCowFromInventory } from './removeCowFromInventory.js'

export const sellCow = (
  state: farmhand.state,
  cow: farmhand.cow
): farmhand.state => {
  const { cowsSold } = state
  const cowColorId = getCowColorId(cow as any)
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
