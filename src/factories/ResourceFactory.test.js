import { itemType } from '../enums'
import { RESOURCE_SPAWN_CHANCE } from '../constants'
import { randomChoice } from '../common/utils'

import ResourceFactory from './ResourceFactory'

jest.mock('./CoalFactory')
jest.mock('./OreFactory')
jest.mock('./StoneFactory')

jest.mock('../common/utils', () => ({
  ...jest.requireActual('../common/utils'),
  randomChoice: jest.fn(),
}))

describe('ResourceFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('generateResources', () => {
    test('it returns null when dice roll is above resource spawn chance', () => {
      global.Math.random.mockReturnValueOnce(RESOURCE_SPAWN_CHANCE + 0.01)

      expect(ResourceFactory.instance().generateResources()).toEqual(null)
    })

    test('it can use the ore factory to generate ore', () => {
      global.Math.random.mockReturnValueOnce(RESOURCE_SPAWN_CHANCE)
      randomChoice.mockReturnValueOnce({ name: itemType.ORE })

      ResourceFactory.instance().generateResources()
      const factory = ResourceFactory.getFactoryForItemType(itemType.ORE)

      expect(factory.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the coal factory to generate coal', () => {
      global.Math.random.mockReturnValueOnce(RESOURCE_SPAWN_CHANCE)
      randomChoice.mockReturnValueOnce({ name: itemType.FUEL })

      ResourceFactory.instance().generateResources()
      const factory = ResourceFactory.getFactoryForItemType(itemType.FUEL)

      expect(factory.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the stone factory to generate stone', () => {
      global.Math.random.mockReturnValueOnce(RESOURCE_SPAWN_CHANCE)
      randomChoice.mockReturnValueOnce({ name: itemType.STONE })

      ResourceFactory.instance().generateResources()
      const factory = ResourceFactory.getFactoryForItemType(itemType.STONE)

      expect(factory.generate).toHaveBeenCalledTimes(1)
    })
  })
})
