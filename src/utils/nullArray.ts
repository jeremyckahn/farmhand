import { memoize } from './memoize.js'

export const nullArray = memoize(
  (arraySize: number) => Object.freeze(new Array(arraySize).fill(null)),
  {
    cacheSize: 30,
  }
)
