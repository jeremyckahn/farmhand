import { vi } from 'vitest'

import { randomNumberService } from '../common/services/randomNumber.js'
import { itemType, toolLevel } from '../enums.js'
import { randomChoice } from '../utils/index.js'

import ResourceFactory from './ResourceFactory.js'

vitest.mock('./CoalFactory.js')
vitest.mock('./OreFactory.js')
vitest.mock('./StoneFactory.js')

vitest.mock('../utils/index.js', async () => ({
  ...(await vitest.importActual('../utils/index.js')),
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
      vi.mocked(randomChoice).mockReturnValueOnce({ itemType: itemType.ORE })

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.ORE)

      expect(factory).toBeTruthy()
      expect(factory?.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the coal factory to generate coal', () => {
      vi.mocked(randomNumberService.isRandomNumberLessThan).mockReturnValue(
        true
      )
      vi.mocked(randomChoice).mockReturnValueOnce({ itemType: itemType.FUEL })

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.FUEL)

      expect(factory).toBeTruthy()
      expect(factory?.generate).toHaveBeenCalledTimes(1)
    })

    test('it can use the stone factory to generate stone', () => {
      vi.mocked(randomNumberService.isRandomNumberLessThan).mockReturnValue(
        true
      )
      vi.mocked(randomChoice).mockReturnValueOnce({ itemType: itemType.STONE })

      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.STONE)

      expect(factory).toBeTruthy()
      expect(factory?.generate).toHaveBeenCalledTimes(1)
    })
  })
})
