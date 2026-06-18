import { genders } from '../enums.js'
import {
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_MILK_RATE_SLOWEST,
  COW_MILK_RATE_FASTEST,
} from '../constants.js'

import { scaleNumber } from './scaleNumber.js'

export const getCowMilkRate = (cow: farmhand.cow): number =>
  cow.gender === genders.FEMALE
    ? scaleNumber(
        cow.weightMultiplier,
        COW_WEIGHT_MULTIPLIER_MINIMUM,
        COW_WEIGHT_MULTIPLIER_MAXIMUM,
        COW_MILK_RATE_SLOWEST,
        COW_MILK_RATE_FASTEST
      )
    : Infinity
