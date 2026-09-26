import { random } from '../common/utils.js'
import { STORM_CHANCE } from '../constants.js'
import { randomStream } from '../enums.js'

export const shouldStormToday = () =>
  random(randomStream.WEATHER) < STORM_CHANCE
