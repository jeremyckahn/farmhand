import { generateCow, getCowValue, moneyTotal } from '../../utils/index.js'
import { PURCHASEABLE_COW_PENS } from '../../constants.js'

import { addCowToInventory } from './addCowToInventory.js'


export const purchaseCow = (state: any, cow: any): any => {
  const {
    cowInventory,
    cowColorsPurchased,
    playerId,
    money,
    purchasedCowPen,
  } = state
  const { color } = cow
  const cowValue = getCowValue(cow, false)

  if (
    money < cowValue ||
    purchasedCowPen === 0 ||
    cowInventory.length >=
      (PURCHASEABLE_COW_PENS.get(purchasedCowPen)?.cows ?? 0)
  ) {
    return state
  }

  state = addCowToInventory(state, {
    ...cow,
    ownerId: playerId,
    originalOwnerId: playerId,
  })

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
