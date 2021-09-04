import { coal, stone } from '../data/ores'
import { itemType } from '../enums'
import {
  RESOURCE_SPAWN_CHANCE,
  ORE_SPAWN_CHANCE,
  COAL_SPAWN_CHANCE,
  STONE_SPAWN_CHANCE,
} from '../constants'

import ResourceFactory from './ResourceFactory'

import CoalFactory from './CoalFactory'
import OreFactory from './OreFactory'
import StoneFactory from './StoneFactory'

describe('ResourceFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('spawn', () => {
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

    it('returns null if there is no factory for an item type', () => {
      const item = ResourceFactory.spawn(itemType.SPRINKLER)
      expect(item).toEqual(null)
    })
  })

  describe('generate', () => {
    beforeEach(() => {
      jest.spyOn(CoalFactory, 'generate')
      jest.spyOn(OreFactory, 'generate')
      jest.spyOn(StoneFactory, 'generate')
    })

    it('does not generate anything when dice roll is higher than resource spawn chance', () => {
      global.Math.random.mockReturnValueOnce(RESOURCE_SPAWN_CHANCE + 0.01)
      const resources = ResourceFactory.generate()

      expect(resources).toEqual(null)
    })

    it('uses OreFactory when second dice roll is below ore spawn chance', () => {
      global.Math.random
        .mockReturnValueOnce(RESOURCE_SPAWN_CHANCE)
        .mockReturnValueOnce(ORE_SPAWN_CHANCE)
      ResourceFactory.generate()

      expect(OreFactory.generate).toHaveBeenCalledTimes(1)
    })

    it('uses CoalFactory when second dice roll is below coal spawn chance', () => {
      global.Math.random
        .mockReturnValueOnce(RESOURCE_SPAWN_CHANCE)
        .mockReturnValueOnce(COAL_SPAWN_CHANCE)
      ResourceFactory.generate()

      expect(CoalFactory.generate).toHaveBeenCalledTimes(1)
    })

    it('uses StoneFactory when second dice roll is below stone spawn chance', () => {
      global.Math.random
        .mockReturnValueOnce(RESOURCE_SPAWN_CHANCE)
        .mockReturnValueOnce(STONE_SPAWN_CHANCE)
      ResourceFactory.generate()

      expect(StoneFactory.generate).toHaveBeenCalledTimes(1)
    })
  })
})
