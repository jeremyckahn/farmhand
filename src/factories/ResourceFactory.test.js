import { coal, stone } from '../data/ores'
import { itemType } from '../enums'
import { COAL_SPAWN_CHANCE, STONE_SPAWN_CHANCE } from '../constants'

import { ResourceFactory, CoalFactory, StoneFactory } from './ResourceFactory'

jest.mock('./ResourceFactory', () => ({
  ...jest.requireActual('./ResourceFactory'),
}))

describe('ResourceFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('can spawn stones', () => {
    const item = ResourceFactory.spawn(itemType.STONE)
    expect(item).toEqual(stone)
  })

  it('can spawn coal', () => {
    const item = ResourceFactory.spawn(itemType.FUEL)
    expect(item).toEqual(coal)
  })

  it('can spawn ore', () => {
    global.Math.random.mockReturnValueOnce(0)
    const item = ResourceFactory.spawn(itemType.ORE)
    expect(item.type).toEqual(itemType.ORE)
  })
})

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
      expect(StoneFactory.generate()).toEqual([stone])
    })

    test('it does not generate a stone when dice roll exceeds spawnChance', () => {
      global.Math.random.mockReturnValueOnce(STONE_SPAWN_CHANCE + 0.01)
      expect(StoneFactory.generate()).toEqual([])
    })
  })
})

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
      expect(CoalFactory.generate()).toEqual([])
    })

    test('it uses a second dice roll to determine how many coal to spawn', () => {
      global.Math.random
        .mockReturnValueOnce(COAL_SPAWN_CHANCE)
        .mockReturnValueOnce(0)
      let numCoalSpawned = 0
      const spawns = CoalFactory.generate()

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
      const spawns = CoalFactory.generate()

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
