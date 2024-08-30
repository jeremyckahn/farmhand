import { randomNumberService } from '../common/services/randomNumber'
import { itemType, toolLevel } from '../enums'
import { randomChoice } from '../utils'

import ResourceFactory from './ResourceFactory'

vitest.mock('./CoalFactory')
vitest.mock('./OreFactory')
vitest.mock('./StoneFactory')

vitest.mock('../utils', async () => ({
  ...(await vitest.importActual('../utils')),
  randomChoice: vitest.fn(),
}))

beforeEach(() => {
  vitest.spyOn(randomNumberService, 'isRandomNumberLessThan')
})

describe('ResourceFactory', () => {
  let shovelLevel = toolLevel.DEFAULT

  describe('generateResources', () => {
    test('does not spawn any resources when dice roll is above resource spawn chance', () => {
      randomNumberService.isRandomNumberLessThan.mockReturnValue(false)

      expect(ResourceFactory.instance().generateResources(shovelLevel)).toEqual(
        []
      )
    })

    test('it can use the ore factory to generate ore', () => {
      randomNumberService.isRandomNumberLessThan.mockReturnValue(true)
      randomChoice.mockReturnValueOnce({ itemType: itemType.ORE })

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.ORE)

      expect(factory.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the coal factory to generate coal', () => {
      randomNumberService.isRandomNumberLessThan.mockReturnValue(true)
      randomChoice.mockReturnValueOnce({ itemType: itemType.FUEL })

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.FUEL)

      expect(factory.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the stone factory to generate stone', () => {
      randomNumberService.isRandomNumberLessThan.mockReturnValue(true)
      randomChoice.mockReturnValueOnce({ itemType: itemType.STONE })

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.STONE)

      expect(factory.generate).toHaveBeenCalledTimes(1)
    })
  })
})
