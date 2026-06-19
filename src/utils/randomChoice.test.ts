import { vitest } from 'vitest'

import { randomChoice } from './randomChoice.js'

describe('randomChoice', () => {
  const choices = [
    { weight: 0.2, name: 'first-choice' },
    { weight: 0.5, name: 'second-choice' },
    { weight: 0.3, name: 'third-choice' },
  ]

  beforeEach(() => {
    vitest.spyOn(global.Math, 'random')
  })

  test('it returns a choice at random', () => {
    const choice = randomChoice(choices)

    expect(choices.includes(choice)).toEqual(true)
  })

  test('it can handle the lower bound of Math.random', () => {
    ;(global.Math.random as import('vitest').Mock).mockReturnValueOnce(0)
    const choice = randomChoice(choices)

    expect(choice).toEqual(choices[0])
  })

  test('it can handle the upper bound of Math.random', () => {
    ;(global.Math.random as import('vitest').Mock).mockReturnValueOnce(0.99)
    const choice = randomChoice(choices)

    expect(choice).toEqual(choices[1])
  })
})
