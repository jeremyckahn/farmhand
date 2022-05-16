import { PRECIPITATION_CHANCE } from '../../constants'

import { applyChanceEvent } from './helpers'
import { applyPrecipitation } from './applyPrecipitation'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processWeather = state =>
  applyChanceEvent([[PRECIPITATION_CHANCE, applyPrecipitation]], state)
