import { shouldPrecipitateToday } from '../../utils'

import { applyChanceEvent } from './helpers'
import { applyPrecipitation } from './applyPrecipitation'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processWeather = state =>
  applyChanceEvent([[shouldPrecipitateToday, applyPrecipitation]], state)
