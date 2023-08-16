/** @typedef {import("../index").farmhand.plotContent} farmhand.plotContent */
import { memoize } from './memoize'

import { memoizationSerializer } from './'

export const findInField = memoize(
  /**
   * @param {(?farmhand.plotContent)[][]} field
   * @param {function(?farmhand.plotContent): boolean} condition
   * @returns {?farmhand.plotContent}
   */
  (field, condition) => {
    for (const row of field) {
      for (const plot of row) {
        if (condition(plot)) {
          return plot
        }
      }
    }

    return null
  },
  {
    serializer: memoizationSerializer,
  }
)
