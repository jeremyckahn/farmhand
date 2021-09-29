import { itemType, toolLevel } from '../enums'
import { isRandomNumberLessThan, randomChoice } from '../utils'

import ResourceFactory from './ResourceFactory'

jest.mock('./CoalFactory')
jest.mock('./OreFactory')
jest.mock('./StoneFactory')

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  randomChoice: jest.fn(),
  isRandomNumberLessThan: jest.fn(),
}))

describe('ResourceFactory', () => {
  let shovelLevel = toolLevel.DEFAULT

  describe('generateResources', () => {
    test('does not spawn any resources when dice roll is above resource spawn chance', () => {
      isRandomNumberLessThan.mockReturnValue(false)

      expect(ResourceFactory.instance().generateResources(shovelLevel)).toEqual(
        []
      )
    })

    test('it can use the ore factory to generate ore', () => {
      isRandomNumberLessThan.mockReturnValue(true)
      randomChoice.mockReturnValueOnce({ itemType: itemType.ORE })

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.ORE)

      expect(factory.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the coal factory to generate coal', () => {
      isRandomNumberLessThan.mockReturnValue(true)
      randomChoice.mockReturnValueOnce({ itemType: itemType.FUEL })

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.FUEL)

      expect(factory.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the stone factory to generate stone', () => {
      isRandomNumberLessThan.mockReturnValue(true)
      randomChoice.mockReturnValueOnce({ itemType: itemType.STONE })

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.STONE)

      expect(factory.generate).toHaveBeenCalledTimes(1)
    })
  })
})
