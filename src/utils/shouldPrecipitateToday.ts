import { random } from '../common/utils.js'
import { PRECIPITATION_CHANCE } from '../constants.js'
import { randomStream } from '../enums.js'

export const shouldPrecipitateToday = () =>
  random(randomStream.PRECIPITATION) < PRECIPITATION_CHANCE
