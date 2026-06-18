import { experienceNeededForLevel } from './experienceNeededForLevel.js'

describe('experienceNeededForLevel', () => {
  test.each([
    [0, 1],
    [100, 2],
    [400, 3],
    [980100, 100],
  ])('it returns %s experience for level %s', (experienceNeeded, levelNum) => {
    expect(experienceNeededForLevel(levelNum)).toEqual(experienceNeeded)
  })
})
