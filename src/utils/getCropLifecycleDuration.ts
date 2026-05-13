import { memoize } from './memoize.js'

export const getCropLifecycleDuration = memoize(
  ({ cropTimeline }: { cropTimeline: number[] }) => {
    return cropTimeline.reduce((acc, value) => {
      return acc + value
    }, 0)
  }
)
