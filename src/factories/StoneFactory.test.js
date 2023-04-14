import { randomNumberService } from '../common/services/randomNumber'
import { coal, stone, saltRock } from '../data/ores'

import StoneFactory from './StoneFactory'

beforeEach(() => {
  jest.spyOn(randomNumberService, 'isRandomNumberLessThan')
})

describe('StoneFactory', () => {
  describe('generate', () => {
    let stoneFactory

    beforeEach(() => {
      stoneFactory = new StoneFactory()
    })

    test('it generates stones', () => {
      randomNumberService.isRandomNumberLessThan.mockReturnValue(true)

      const resources = stoneFactory.generate()

      expect(resources[0]).toEqual(stone)
    })

    test('it generates a coal along with the stone when random chance passes', () => {
      randomNumberService.isRandomNumberLessThan.mockReturnValue(true)

      const resources = stoneFactory.generate()

      expect(resources).toEqual([stone, saltRock, coal])
    })
  })
})
