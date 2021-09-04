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

      expect(resources).toEqual([coal, stone])
    })

    test('it randomly produces more than one coal and stone', () => {
      global.Math.random.mockReturnValueOnce(1)
      const resources = coalFactory.generate()

      expect(resources.length > 2).toEqual(true)
      expect(resources[0]).toEqual(coal)
      expect(resources[resources.length - 1]).toEqual(stone)
    })
  })
})
