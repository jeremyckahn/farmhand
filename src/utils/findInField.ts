import { memoize } from './memoize.js'

import { memoizationSerializer } from './index.js'

export const findInField = memoize(
  (
    field: (farmhand.plotContent | null)[][],
    condition: (arg0: farmhand.plotContent | null) => boolean
  ): farmhand.plotContent | null => {
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
