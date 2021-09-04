import { COAL_SPAWN_CHANCE } from '../constants'
import { coal, stone } from '../data/ores'

import CoalFactory from './CoalFactory'
import StoneFactory from './StoneFactory'

describe('CoalFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('spawn', () => {
    test('it can spawn coal', () => {
      expect(CoalFactory.spawn()).toEqual(coal)
    })
  })

  describe('generate', () => {
    test('it does not generate any coal when dice roll exceeds spawn chance', () => {
      global.Math.random.mockReturnValueOnce(COAL_SPAWN_CHANCE + 0.01)
      expect(CoalFactory.generate(StoneFactory)).toEqual([])
    })

    test('it uses a second dice roll to determine how many coal to spawn', () => {
      global.Math.random
        .mockReturnValueOnce(COAL_SPAWN_CHANCE)
        .mockReturnValueOnce(0)
      let numCoalSpawned = 0
      const spawns = CoalFactory.generate(StoneFactory)

      for (let item of spawns) {
        if (item.id === coal.id) {
          numCoalSpawned++
        }
      }

      expect(numCoalSpawned).toEqual(1)
    })

    test('it spawns a rock for every coal spawned', () => {
      global.Math.random
        .mockReturnValueOnce(COAL_SPAWN_CHANCE)
        .mockReturnValueOnce(1)
      let numCoalSpawned = 0,
        numStoneSpawned = 0
      const spawns = CoalFactory.generate(StoneFactory)

      for (let item of spawns) {
        if (item.id === coal.id) {
          numCoalSpawned++
        } else if (item.id === stone.id) {
          numStoneSpawned++
        }
      }

      expect(numCoalSpawned).toEqual(numStoneSpawned)
    })
  })
})
