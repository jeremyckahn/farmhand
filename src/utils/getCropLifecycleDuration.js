import { memoize } from './memoize'

// TODO: Refactor this to accept just a plain cropTimetable
/**
 * @param {{ cropTimetable: Object }} crop
 * @returns {number}
 */
export const getCropLifecycleDuration = memoize(({ cropTimetable }) =>
  Object.values(cropTimetable).reduce((acc, value) => acc + value, 0)
)
