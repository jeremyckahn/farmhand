import { INITIAL_FIELD_HEIGHT, INITIAL_FIELD_WIDTH } from '../constants.js'

export const createNewField = () =>
  new Array(INITIAL_FIELD_HEIGHT)
    .fill(undefined)
    .map(() => new Array(INITIAL_FIELD_WIDTH).fill(null))
