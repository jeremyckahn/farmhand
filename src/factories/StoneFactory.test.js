import { STONE_SPAWN_CHANCE, COAL_WITH_STONE_SPAWN_CHANCE } from '../constants'
import { coal, stone } from '../data/ores'

import CoalFactory from './CoalFactory'
import StoneFactory from './StoneFactory'

describe('StoneFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('spawn', () => {
    test('it can spawn a stone', () => {
      expect(StoneFactory.spawn()).toEqual(stone)
    })
  })

  describe('generate', () => {
    test('it generates a stone based on spawnChance', () => {
      global.Math.random.mockReturnValueOnce(STONE_SPAWN_CHANCE)
      const spawns = StoneFactory.generate(CoalFactory)
      expect(spawns[0]).toEqual(stone)
    })

    test('it generates a coal when second dice roll is below chance', () => {
      global.Math.random
        .mockReturnValueOnce(STONE_SPAWN_CHANCE)
        .mockReturnValue(COAL_WITH_STONE_SPAWN_CHANCE)
      const spawns = StoneFactory.generate(CoalFactory)

      expect(spawns).toEqual([stone, coal])
    })

    test('it does not generate a stone when dice roll exceeds spawnChance', () => {
      global.Math.random.mockReturnValueOnce(STONE_SPAWN_CHANCE + 0.01)
      expect(StoneFactory.generate(CoalFactory)).toEqual([])
    })
  })
})
