import { applyChanceEvent } from './helpers.js'
import { applyCrows } from './applyCrows.js'

export const processNerfs = (state: farmhand.state): farmhand.state =>
  applyChanceEvent([[() => true, applyCrows]], state)
