import { moneyTotal } from '../../utils/moneyTotal.js'
import {
  EXPERIENCE_VALUES,
  PURCHASEABLE_WOOD_CHIPPERS,
} from '../../constants.js'
import { WOOD_CHIPPER_AVAILABLE_NOTIFICATION } from '../../strings.js'

import { addExperience } from './addExperience.js'
import { showNotification } from './showNotification.js'
import { updateLearnedRecipes } from './updateLearnedRecipes.js'

export const purchaseWoodChipper = (
  state: farmhand.state,
  woodChipperId: number
): farmhand.state => {
  const { money, purchasedWoodChipper } = state

  if (purchasedWoodChipper >= woodChipperId) return state

  state = {
    ...state,
    purchasedWoodChipper: woodChipperId,
    money: moneyTotal(
      money,
      -(PURCHASEABLE_WOOD_CHIPPERS.get(woodChipperId)?.price ?? 0)
    ),
  }

  state = showNotification(state, WOOD_CHIPPER_AVAILABLE_NOTIFICATION)
  state = addExperience(state, EXPERIENCE_VALUES.WOOD_CHIPPER_ACQUIRED)

  return updateLearnedRecipes(state)
}
