import { applyChanceEvent } from './helpers.js'
import { applyCrows } from './applyCrows.js'


export const processNerfs = state =>
  applyChanceEvent([[() => true, applyCrows]], state)
