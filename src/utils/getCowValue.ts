import {
  COW_MAXIMUM_VALUE_MATURITY_AGE,
  COW_MINIMUM_VALUE_MULTIPLIER,
  COW_MAXIMUM_VALUE_MULTIPLIER,
} from '../constants.js'

import { getCowWeight } from './getCowWeight.js'
import { clampNumber } from './clampNumber.js'
import { scaleNumber } from './scaleNumber.js'

export const getCowValue = (
  cow: farmhand.cow,
  computeSaleValue: boolean = false
): number =>
  computeSaleValue
    ? getCowWeight(cow) *
      clampNumber(
        scaleNumber(
          cow.daysOld,
          1,
          COW_MAXIMUM_VALUE_MATURITY_AGE,
          COW_MINIMUM_VALUE_MULTIPLIER,
          COW_MAXIMUM_VALUE_MULTIPLIER
        ),
        COW_MINIMUM_VALUE_MULTIPLIER,
        COW_MAXIMUM_VALUE_MULTIPLIER
      )
    : getCowWeight(cow) * 1.5
