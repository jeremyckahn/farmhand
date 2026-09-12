import { season } from '../enums.js'

import { getCurrentSeason } from './getCurrentSeason.js'

describe('getCurrentSeason', () => {
  test.each([
    ['returns SPRING for day 0', 0, season.SPRING],
    ['returns SPRING for the last day of spring', 14, season.SPRING],
    ['returns SUMMER for the first day of summer', 15, season.SUMMER],
    ['returns FALL for the first day of fall', 30, season.FALL],
    ['returns WINTER for the first day of winter', 45, season.WINTER],
    ['wraps back around to SPRING after a full year', 60, season.SPRING],
  ] as const)('%s', (_description, dayCount, expectedSeason) => {
    expect(getCurrentSeason(dayCount)).toEqual(expectedSeason)
  })
})
