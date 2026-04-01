import { shouldPrecipitateToday } from '../../utils/index.js'

import { applyChanceEvent } from './helpers.js'
import { applyPrecipitation } from './applyPrecipitation.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processWeather = state =>
  applyChanceEvent([[shouldPrecipitateToday, applyPrecipitation]], state)
