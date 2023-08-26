/** @typedef {import('../../index').farmhand.cow} farmhand.cow */

import { v4 as uuid } from 'uuid'

import { cowColors, genders } from '../../enums'

/**
 * @param {Partial<farmhand.cow>?} overrides
 */
export const getCowStub = (overrides = {}) => {
  /** @type farmhand.cow */
  const cow = {
    baseWeight: 1000,
    color: cowColors.BLUE,
    colorsInBloodline: {},
    daysOld: 1,
    daysSinceMilking: 0,
    daysSinceProducingFertilizer: 0,
    gender: genders.FEMALE,
    happiness: 0,
    happinessBoostsToday: 0,
    id: uuid(),
    isBred: false,
    isUsingHuggingMachine: false,
    name: '',
    originalOwnerId: uuid(),
    ownerId: uuid(),
    timesTraded: 0,
    weightMultiplier: 1,
    ...overrides,
  }

  return cow
}
