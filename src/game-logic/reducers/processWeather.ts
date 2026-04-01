import { shouldPrecipitateToday } from '../../utils/index.tsx'

import { applyChanceEvent } from './helpers.tsx'
import { applyPrecipitation } from './applyPrecipitation.ts'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processWeather = state =>
  applyChanceEvent([[shouldPrecipitateToday, applyPrecipitation]], state)
