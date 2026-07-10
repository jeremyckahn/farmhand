import { v4 as uuid } from 'uuid'

import { genders, standardCowColors, cowColors } from '../enums.js'
import {
  COW_STARTING_WEIGHT_BASE,
  MALE_COW_WEIGHT_MULTIPLIER,
  COW_STARTING_WEIGHT_VARIANCE,
} from '../constants.js'
import { random } from '../common/utils.js'

import { chooseRandom } from './chooseRandom.js'
import { getDefaultCowName } from './getDefaultCowName.js'

export const generateCow = (
  options: {
    gender?: farmhand.cow['gender']
    color?: farmhand.cow['color']
    id?: farmhand.cow['id']
    [key: string]: unknown
  } = {}
): farmhand.cow => {
  const gender =
    (options.gender as farmhand.cow['gender']) ||
    chooseRandom(Object.values(genders))
  const color =
    (options.color as farmhand.cow['color']) ||
    chooseRandom(Object.values(standardCowColors))
  const id = (options.id as farmhand.cow['id']) || uuid()

  const baseWeight = Math.round(
    COW_STARTING_WEIGHT_BASE *
      (gender === genders.MALE ? MALE_COW_WEIGHT_MULTIPLIER : 1) -
      COW_STARTING_WEIGHT_VARIANCE +
      random() * (COW_STARTING_WEIGHT_VARIANCE * 2)
  )

  const cow: farmhand.cow = {
    baseWeight,
    color,
    colorsInBloodline: {
      [color]: true,
    } as Record<farmhand.cowColors, boolean>,
    daysOld: 1,
    daysSinceMilking: 0,
    daysSinceProducingFertilizer: 0,
    gender,
    happiness: 0,
    happinessBoostsToday: 0,
    id,
    isBred: false,
    isUsingHuggingMachine: false,
    name: '',
    ownerId: '',
    originalOwnerId: '',
    timesTraded: 0,
    weightMultiplier: 1,
    ...options,
  }

  cow.name = getDefaultCowName(cow)

  return cow
}
