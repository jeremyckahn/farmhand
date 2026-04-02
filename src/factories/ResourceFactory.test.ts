import { vi } from 'vitest'

import { randomNumberService } from '../common/services/randomNumber.ts'
import { itemType, toolLevel } from '../enums.ts'
import { randomChoice } from '../utils/index.tsx'

import ResourceFactory from './ResourceFactory.ts'

vitest.mock('./CoalFactory.ts')
vitest.mock('./OreFactory.ts')
vitest.mock('./StoneFactory.ts')

vitest.mock('../utils/index.tsx', async () => ({
  ...(await vitest.importActual('../utils/index.tsx')),
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

      // @ts-expect-error
      expect(ResourceFactory.instance().generateResources(shovelLevel)).toEqual(
        []
      )
    })

    test('it can use the ore factory to generate ore', () => {
      vi.mocked(randomNumberService.isRandomNumberLessThan).mockReturnValue(
        true
      )
      vi.mocked(randomChoice).mockReturnValueOnce({ itemType: itemType.ORE })

      // @ts-expect-error
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

      // @ts-expect-error
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

      // @ts-expect-error
      ResourceFactory.instance().generateResources(shovelLevel)
      const factory = ResourceFactory.getFactoryForItemType(itemType.STONE)

      expect(factory).toBeTruthy()
      expect(factory?.generate).toHaveBeenCalledTimes(1)
    })
  })
})
