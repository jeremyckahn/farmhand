import { generateCow, getCowValue, moneyTotal } from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'

import { addCowToInventory } from './addCowToInventory'

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const purchaseCow = (state, cow) => {
  const { cowInventory, cowColorsPurchased, id, money, purchasedCowPen } = state
  const { color } = cow
  const cowValue = getCowValue(cow, false)

  if (
    money < cowValue ||
    purchasedCowPen === 0 ||
    cowInventory.length >= PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows
  ) {
    return state
  }

  state = addCowToInventory(state, { ...cow, ownerId: id, originalOwnerId: id })

  return {
    ...state,
    cowColorsPurchased: {
      ...cowColorsPurchased,
      [color]: (cowColorsPurchased[color] || 0) + 1,
    },
    money: moneyTotal(money, -cowValue),
    cowForSale: generateCow(),
  }
}
