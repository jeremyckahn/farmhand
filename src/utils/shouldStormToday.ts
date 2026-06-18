import { random } from '../common/utils.js'
import { STORM_CHANCE } from '../constants.js'

export const shouldStormToday = () => random() < STORM_CHANCE
