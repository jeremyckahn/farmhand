import { levels } from '../data/levels.js'
import { INITIAL_SPRINKLER_RANGE } from '../constants.js'

import { memoize } from './memoize.js'

/**
 * @param levelNumber
 * @returns {levelEntitlements} Contains `sprinklerRange` and keys that correspond to
 * unlocked items.
 */
export const getLevelEntitlements = memoize(
  /**
   * @param levelNumber
   * @returns {levelEntitlements}
   */
  levelNumber => {
    const acc: farmhand.levelEntitlements = {
      sprinklerRange: INITIAL_SPRINKLER_RANGE,
      items: {},
      tools: {},
      stageFocusType: {},
    }

    // Assumes that levels is sorted by id.
    levels.find(
      ({
        unlocksShopItem,
        unlocksStageFocusType,
        unlocksTool,
        id,
        increasesSprinklerRange,
      }) => {
        if (increasesSprinklerRange) {
          acc.sprinklerRange++
        }

        if (unlocksShopItem) {
          acc.items[unlocksShopItem as keyof typeof acc.items] = true
        }

        if (unlocksTool) {
          acc.tools[unlocksTool as keyof typeof acc.tools] = true
        }

        if (unlocksStageFocusType) {
          acc.stageFocusType[
            unlocksStageFocusType as keyof typeof acc.stageFocusType
          ] = true
        }

        return id === levelNumber
      }
    )

    return acc
  }
)
