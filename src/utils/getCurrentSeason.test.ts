import { season } from '../enums.js'

import { getCurrentSeason } from './getCurrentSeason.js'

describe('getCurrentSeason', () => {
  test('returns SPRING for day 0', () => {
    expect(getCurrentSeason(0)).toEqual(season.SPRING)
  })

  test('returns SPRING for the last day of spring', () => {
    expect(getCurrentSeason(14)).toEqual(season.SPRING)
  })

  test('returns SUMMER for the first day of summer', () => {
    expect(getCurrentSeason(15)).toEqual(season.SUMMER)
  })

  test('returns FALL for the first day of fall', () => {
    expect(getCurrentSeason(30)).toEqual(season.FALL)
  })

  test('returns WINTER for the first day of winter', () => {
    expect(getCurrentSeason(45)).toEqual(season.WINTER)
  })

  test('wraps back around to SPRING after a full year', () => {
    expect(getCurrentSeason(60)).toEqual(season.SPRING)
  })
})
