import { getDayOfSeason } from './getDayOfSeason.js'

describe('getDayOfSeason', () => {
  test('returns 1 for the first day of a season', () => {
    expect(getDayOfSeason(0)).toEqual(1)
  })

  test('returns the season length for the last day of a season', () => {
    expect(getDayOfSeason(14)).toEqual(15)
  })

  test('resets to 1 on the first day of the next season', () => {
    expect(getDayOfSeason(15)).toEqual(1)
  })

  test('continues counting in later seasons', () => {
    expect(getDayOfSeason(32)).toEqual(3)
  })
})
