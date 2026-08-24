import { vi } from 'vitest'

import { randomNumberService } from '../common/services/randomNumber.js'
import { itemType, toolLevel } from '../enums.js'
import { Factory } from '../interfaces/Factory.js'
import { randomChoice } from '../utils/randomChoice.js'

import ResourceFactory from './ResourceFactory.js'

type ResourceOption = { weight: number; itemType: itemType }
vitest.mock('./CoalFactory.js')
vitest.mock('./OreFactory.js')
vitest.mock('./StoneFactory.js')

vitest.mock('../utils/randomChoice.js', () => ({
  randomChoice: vitest.fn(),
}))

beforeEach(() => {
  vitest.spyOn(randomNumberService, 'isRandomNumberLessThan')
})

describe('ResourceFactory', () => {
  let shovelLevel = toolLevel.DEFAULT

  describe('generateResources', () => {
    test('does not spawn any resources when dice roll is above resource spawn chance', () => {
      vi.mocked(randomNumberService.isRandomNumberLessThan).mockReturnValue(
        false
      )

      expect(ResourceFactory.instance().generateResources(shovelLevel)).toEqual(
        []
      )
    })

    test('it can use the ore factory to generate ore', () => {
      vi.mocked(randomNumberService.isRandomNumberLessThan).mockReturnValue(
        true
      )
      vi.mocked(randomChoice).mockReturnValueOnce({
        itemType: itemType.ORE as itemType,
        weight: 0,
      } as ResourceOption)

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.ORE)

      expect(factory).toBeTruthy()
      expect(factory?.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the coal factory to generate coal', () => {
      vi.mocked(randomNumberService.isRandomNumberLessThan).mockReturnValue(
        true
      )
      vi.mocked(randomChoice).mockReturnValueOnce({
        itemType: itemType.FUEL as itemType,
        weight: 0,
      } as ResourceOption)

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.FUEL)

      expect(factory).toBeTruthy()
      expect(factory?.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the stone factory to generate stone', () => {
      vi.mocked(randomNumberService.isRandomNumberLessThan).mockReturnValue(
        true
      )
      vi.mocked(randomChoice).mockReturnValueOnce({
        itemType: itemType.STONE as itemType,
        weight: 0,
      } as ResourceOption)

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.STONE)

      expect(factory).toBeTruthy()
      expect(factory?.generate).toHaveBeenCalledTimes(1)
    })

    test('does not include resources when a factory generate returns null', () => {
      vi.mocked(randomNumberService.isRandomNumberLessThan).mockReturnValue(
        true
      )
      vi.mocked(randomChoice).mockReturnValueOnce({
        itemType: itemType.ORE as itemType,
        weight: 0,
      } as ResourceOption)

      const oreFactory = ResourceFactory.getFactoryForItemType(
        itemType.ORE
      ) as Factory

      vi.mocked(oreFactory.generate).mockReturnValueOnce(null)

      expect(ResourceFactory.instance().generateResources(shovelLevel)).toEqual(
        []
      )
    })
  })
})
