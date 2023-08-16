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
    /** @type {?farmhand.plotContent} */
    let foundPlot = null

    field.find(row => {
      const matchingPlot = row.find(condition)

      if (matchingPlot) {
        foundPlot = matchingPlot
      }

      return matchingPlot
    })

    return foundPlot
  },
  {
    serializer: memoizationSerializer,
  }
)
