import { season } from '../enums.js'

import { getCurrentSeason } from './getCurrentSeason.js'

describe('getCurrentSeason', () => {
  test.each([
    ['returns SPRING for day 1', 1, season.SPRING],
    ['returns SPRING for the last day of spring', 15, season.SPRING],
    ['returns SUMMER for the first day of summer', 16, season.SUMMER],
    ['returns FALL for the first day of fall', 31, season.FALL],
    ['returns WINTER for the first day of winter', 46, season.WINTER],
    ['wraps back around to SPRING after a full year', 61, season.SPRING],
  ] as const)('%s', (_description, dayCount, expectedSeason) => {
    expect(getCurrentSeason(dayCount)).toEqual(expectedSeason)
  })
})
