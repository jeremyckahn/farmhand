import { memoize } from './memoize.ts'

/**
 * @param {{ cropTimeline: number[] }} crop
 * @returns {number}
 */
// @ts-expect-error
export const getCropLifecycleDuration = memoize(({ cropTimeline }) => {
  return cropTimeline.reduce((acc, value) => {
    return acc + value
  }, 0)
})
