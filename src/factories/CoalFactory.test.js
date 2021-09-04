import { coal, stone } from '../data/ores'

import CoalFactory from './CoalFactory'

describe('CoalFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('generate', () => {
    let coalFactory

    beforeEach(() => {
      coalFactory = new CoalFactory()
    })

    test('it produces at least one coal and one stone', () => {
      global.Math.random.mockReturnValueOnce(0)
      const resources = coalFactory.generate()

      expect(resources).toHaveLength(2)
    })

    test('it randomly produces more than one coal and stone', () => {
      global.Math.random.mockReturnValueOnce(1)
      const resources = coalFactory.generate()

      let numCoalSpawned = 0,
        numStoneSpawned = 0

      for (let item of resources) {
        if (item.id === coal.id) {
          numCoalSpawned++
        } else if (item.id === stone.id) {
          numStoneSpawned++
        }
      }

      expect(numCoalSpawned).toEqual(numStoneSpawned)
    })
  })
})
