import { COAL_SPAWN_CHANCE } from '../constants'
import { coal, stone } from '../data/ores'

import StoneFactory from './StoneFactory'

describe('StoneFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('generate', () => {
    let stoneFactory

    beforeEach(() => {
      stoneFactory = new StoneFactory()
    })

    test('it generates stones', () => {
      const resources = stoneFactory.generate()

      expect(resources[0]).toEqual(stone)
    })

    test('it randomly generates a coal along with the stone', () => {
      global.Math.random.mockReturnValueOnce(COAL_SPAWN_CHANCE)
      const resources = stoneFactory.generate()

      expect(resources).toEqual([stone, coal])
    })
  })
})
