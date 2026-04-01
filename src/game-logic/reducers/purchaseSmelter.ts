import { moneyTotal } from '../../utils/index.tsx'
import { EXPERIENCE_VALUES, PURCHASEABLE_SMELTERS } from '../../constants.ts'
import { FORGE_AVAILABLE_NOTIFICATION } from '../../strings.ts'

import { addExperience } from './addExperience.ts'
import { showNotification } from './showNotification.ts'
import { updateLearnedRecipes } from './updateLearnedRecipes.ts'

/**
 * @param {farmhand.state} state
 * @param {number} smelterId
 * @returns {farmhand.state}
 */
export const purchaseSmelter = (state, smelterId) => {
  const { money, purchasedSmelter } = state

  if (purchasedSmelter >= smelterId) return state

  state = {
    ...state,
    purchasedSmelter: smelterId,
    money: moneyTotal(
      money,
      -(PURCHASEABLE_SMELTERS.get(smelterId)?.price ?? 0)
    ),
  }

  state = showNotification(state, FORGE_AVAILABLE_NOTIFICATION)
  state = addExperience(state, EXPERIENCE_VALUES.SMELTER_ACQUIRED)

  return updateLearnedRecipes(state)
}
