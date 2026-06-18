import { genders } from '../enums.js'
import {
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
  COW_FERTILIZER_PRODUCTION_RATE_FASTEST,
} from '../constants.js'

import { scaleNumber } from './scaleNumber.js'

export const getCowFertilizerProductionRate = (cow: farmhand.cow): number =>
  cow.gender === genders.MALE
    ? scaleNumber(
        cow.weightMultiplier,
        COW_WEIGHT_MULTIPLIER_MINIMUM,
        COW_WEIGHT_MULTIPLIER_MAXIMUM,
        COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
        COW_FERTILIZER_PRODUCTION_RATE_FASTEST
      )
    : Infinity
