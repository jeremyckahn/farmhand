import { getRandomLifespanExtension } from './getRandomLifespanExtension.js'

describe('getRandomLifespanExtension', () => {
  test('resolves to 0 when the first roll is immediately beaten', () => {
    vitest.spyOn(Math, 'random').mockReturnValue(0)

    expect(getRandomLifespanExtension()).toBe(0)
  })

  test('hits the safety cap when the roll is never beaten', () => {
    vitest.spyOn(Math, 'random').mockReturnValue(0.999)

    // TREE_DEATH_CHANCE_MAX (0.85) never exceeds a roll of 0.999, so the
    // loop always falls back to the MAX_ITERATIONS safety cap.
    expect(getRandomLifespanExtension()).toBe(1000)
  })

  test('stops on the first day the roll is beaten', () => {
    // getTreeDeathChance(0) is 0.05, getTreeDeathChance(1) is 0.07 - a
    // roll of 0.06 survives day 0 but is beaten on day 1.
    vitest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.06)
      .mockReturnValueOnce(0.06)

    expect(getRandomLifespanExtension()).toBe(1)
  })
})
