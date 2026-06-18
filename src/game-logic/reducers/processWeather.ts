import { shouldPrecipitateToday } from '../../utils/shouldPrecipitateToday.js'

import { applyChanceEvent } from './helpers.js'
import { applyPrecipitation } from './applyPrecipitation.js'

export const processWeather = (state: farmhand.state): farmhand.state =>
  applyChanceEvent([[shouldPrecipitateToday, applyPrecipitation]], state)
