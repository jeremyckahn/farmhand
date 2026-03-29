/** @typedef {farmhand.levelEntitlements} levelEntitlements */
import { levels } from '../data/levels.js'
import { INITIAL_SPRINKLER_RANGE } from '../constants.js'

import { memoize } from './memoize.js'

/**
 * @param {number} levelNumber
 * @returns {levelEntitlements} Contains `sprinklerRange` and keys that correspond to
 * unlocked items.
 */
// @ts-expect-error
export const getLevelEntitlements = memoize(
  /**
   * @param {number} levelNumber
   * @returns {levelEntitlements}
   */
  levelNumber => {
    /** @type levelEntitlements */
    const acc = {
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
          // @ts-expect-error
          acc.items[unlocksShopItem] = true
        }

        if (unlocksTool) {
          // @ts-expect-error
          acc.tools[unlocksTool] = true
        }

        if (unlocksStageFocusType) {
          // @ts-expect-error
          acc.stageFocusType[unlocksStageFocusType] = true
        }

        return id === levelNumber
      }
    )

    return acc
  }
)
