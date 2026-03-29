import { memoize } from './memoize.js'

import { memoizationSerializer } from './index.js'

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
