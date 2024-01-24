/** @typedef {import("../index").farmhand.levelEntitlements} levelEntitlements */
import { levels } from '../data/levels'
import { INITIAL_SPRINKLER_RANGE } from '../constants'

import { memoize } from './memoize'

/**
 * @param {number} levelNumber
 * @returns {levelEntitlements} Contains `sprinklerRange` and keys that correspond to
 * unlocked items.
 */
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
          acc.items[unlocksShopItem] = true
        }

        if (unlocksTool) {
          acc.tools[unlocksTool] = true
        }

        if (unlocksStageFocusType) {
          acc.stageFocusType[unlocksStageFocusType] = true
        }

        return id === levelNumber
      }
    )

    return acc
  }
)
