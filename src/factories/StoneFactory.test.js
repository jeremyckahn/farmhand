import { randomNumberService } from '../common/services/randomNumber'
import { coal, stone, saltRock } from '../data/ores'

import StoneFactory from './StoneFactory'

beforeEach(() => {
  vitest.spyOn(randomNumberService, 'isRandomNumberLessThan')
})

describe('StoneFactory', () => {
  describe('generate', () => {
    let stoneFactory

    beforeEach(() => {
      stoneFactory = new StoneFactory()
    })

    test('it generates resources', () => {
      randomNumberService.isRandomNumberLessThan.mockReturnValue(true)

      const resources = stoneFactory.generate()

      expect(resources).toHaveLength(3)
      expect(resources).toContain(stone)
      expect(resources).toContain(saltRock)
      expect(resources).toContain(coal)
    })
  })
})
