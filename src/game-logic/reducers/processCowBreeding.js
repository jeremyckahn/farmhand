import { findCowById, generateOffspringCow } from '../../utils/index.js'
import { cowColors } from '../../enums.js'
import {
  EXPERIENCE_VALUES,
  COW_GESTATION_PERIOD_DAYS,
  COW_MINIMUM_HAPPINESS_TO_BREED,
  PURCHASEABLE_COW_PENS,
} from '../../constants.js'
import { COW_BORN_MESSAGE } from '../../templates.js'

import { addExperience } from './addExperience.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processCowBreeding = state => {
  const {
    cowBreedingPen,
    cowInventory,
    id,
    newDayNotifications,
    purchasedCowPen,
  } = state
  const { cowId1, cowId2 } = cowBreedingPen

  if (!cowId2) {
    return state
  }

  const cow1 = findCowById(cowInventory, cowId1)
  const cow2 = findCowById(cowInventory, cowId2)

  // Same-sex couples are as valid and wonderful as any, but in this game they
  // cannot naturally produce offspring.
  if (cow1.gender === cow2.gender) {
    return state
  }

  const daysUntilBirth =
    cow1.happiness >= COW_MINIMUM_HAPPINESS_TO_BREED &&
    cow2.happiness >= COW_MINIMUM_HAPPINESS_TO_BREED
      ? cowBreedingPen.daysUntilBirth - 1
      : COW_GESTATION_PERIOD_DAYS

  const shouldGenerateOffspring =
    cowInventory.length < PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows &&
    daysUntilBirth === 0

  const offspringCow =
    shouldGenerateOffspring && generateOffspringCow(cow1, cow2, id)

  if (offspringCow) {
    const experienceGained =
      offspringCow.color === cowColors.RAINBOW
        ? EXPERIENCE_VALUES.RAINBOW_COW_BRED
        : EXPERIENCE_VALUES.COW_BRED
    state = addExperience(state, experienceGained)
  }

  return {
    ...state,
    cowInventory: shouldGenerateOffspring
      ? [...cowInventory, offspringCow]
      : cowInventory,
    cowBreedingPen: {
      ...cowBreedingPen,
      daysUntilBirth: shouldGenerateOffspring
        ? COW_GESTATION_PERIOD_DAYS
        : daysUntilBirth,
    },
    newDayNotifications: offspringCow
      ? [
          ...newDayNotifications,
          {
            message: COW_BORN_MESSAGE`${cow1}${cow2}${offspringCow}`,
            severity: 'success',
          },
        ]
      : newDayNotifications,
  }
}
