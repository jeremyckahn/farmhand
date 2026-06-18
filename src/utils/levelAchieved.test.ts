import { levelAchieved } from './levelAchieved.js'

describe('levelAchieved', () => {
  const cases = [
    [1, 0],
    [2, 100],
    [2, 150],
    [3, 400],
    [100, 980100],
  ]

  test.each(cases)(
    `returns level %p for %p experience`,
    (expectedLevel, experience) => {
      expect(levelAchieved(experience)).toEqual(expectedLevel)
    }
  )
})
