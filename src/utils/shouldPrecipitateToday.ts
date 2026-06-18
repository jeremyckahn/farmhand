import { random } from '../common/utils.js'
import { PRECIPITATION_CHANCE } from '../constants.js'

export const shouldPrecipitateToday = () => random() < PRECIPITATION_CHANCE
