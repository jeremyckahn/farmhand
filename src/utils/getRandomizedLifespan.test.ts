import { getRandomizedLifespan } from './getRandomizedLifespan.js'

describe('getRandomizedLifespan', () => {
  test('floors at the max early-death variance when the first roll is 1', () => {
    // First call: floor roll (max variance -> 200 * (1 - 1 * 0.05) = 190).
    // All subsequent calls: extension roll of 0, which is immediately
    // beaten by getTreeDeathChance(0) (0.05), so the extension is 0.
    vitest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(1)
      .mockReturnValue(0)

    expect(getRandomizedLifespan(200)).toBe(190)
  })

  test('floors at exactly the default when the first roll is 0', () => {
    vitest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValue(0)

    expect(getRandomizedLifespan(200)).toBe(200)
  })

  test('composes the floor and the extension additively', () => {
    // First call: floor roll of 0 -> no early shortfall (floor stays 200).
    // Next two calls: extension survives day 0 (0.06 >= 0.05) then is
    // beaten on day 1 (0.06 < 0.07), landing on a 1-day extension.
    vitest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.06)
      .mockReturnValueOnce(0.06)

    expect(getRandomizedLifespan(200)).toBe(201)
  })
})
