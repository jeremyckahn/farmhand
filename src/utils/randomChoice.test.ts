import {
    cropLifeStage
} from '../enums.js'

import {
    randomChoice
} from './index.js'


const { SEED, GROWING, GROWN } = cropLifeStage

const percentageStringTests = [
  [0, '0%'],
  [0.5, '50%'],
  [1, '100%'],
  [1.5, '150%'],
  [2, '200%'],
]

const dollarStringTests = [
  [0, '$0.00'],
  [0.5, '$0.50'],
  [1, '$1.00'],
  [1.5, '$1.50'],
  [2, '$2.00'],
]

const integerStringTests = [
  [0, '0'],
  [0.5, '1'],
  [1, '1'],
  [1.5, '2'],
  [2, '2'],
]


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
