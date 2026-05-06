import { memoize } from './memoize.js'

/**
 * @param } crop

 */
export const getCropLifecycleDuration = memoize(
  ({ cropTimeline }: { cropTimeline: number[] }) => {
    return cropTimeline.reduce((acc, value) => {
      return acc + value
    }, 0)
  }
)
