import { INITIAL_FOREST_HEIGHT, INITIAL_FOREST_WIDTH } from '../constants.js'

export const createNewForest = () => {
  return new Array(INITIAL_FOREST_HEIGHT)
    .fill(undefined)
    .map(() => new Array(INITIAL_FOREST_WIDTH).fill(null))
}
