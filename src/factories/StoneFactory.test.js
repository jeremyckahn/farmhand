import { coal, stone } from '../data/ores'

import { isRandomNumberLessThan } from '../utils'

import StoneFactory from './StoneFactory'

jest.mock('../utils/isRandomNumberLessThan')

describe('StoneFactory', () => {
  describe('generate', () => {
    let stoneFactory

    beforeEach(() => {
      stoneFactory = new StoneFactory()
    })

    test('it generates stones', () => {
      const resources = stoneFactory.generate()

      expect(resources[0]).toEqual(stone)
    })

    test('it generates a coal along with the stone when random chance passes', () => {
      isRandomNumberLessThan.mockReturnValue(true)
      const resources = stoneFactory.generate()

      expect(resources).toEqual([stone, coal])
    })
  })
})
