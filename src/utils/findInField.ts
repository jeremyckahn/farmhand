import { memoize } from './memoize.ts'

import { memoizationSerializer } from './index.tsx'

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
