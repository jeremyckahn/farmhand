import { memoize } from './memoize'

// TODO: Refactor this to accept just a plain cropTimetable
// https://github.com/jeremyckahn/farmhand/issues/415
/**
 * @param {{ cropTimetable: Object }} crop
 * @returns {number}
 */
export const getCropLifecycleDuration = memoize(({ cropTimetable }) => {
  return Object.values(cropTimetable).reduce((acc, value) => {
    if (Array.isArray(value)) {
      return acc + value.reduce((acc2, value2) => acc2 + value2)
    }

    return acc + value
  }, 0)
})
