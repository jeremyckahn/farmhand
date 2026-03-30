import { randomNumberService } from '../common/services/randomNumber.ts'
import { coal, stone, saltRock } from '../data/ores/index.ts'

import StoneFactory from './StoneFactory.ts'

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
      // @ts-expect-error
      randomNumberService.isRandomNumberLessThan.mockReturnValue(true)

      const resources = stoneFactory.generate()

      expect(resources).toHaveLength(3)
      expect(resources).toContain(stone)
      expect(resources).toContain(saltRock)
      expect(resources).toContain(coal)
    })
  })
})
