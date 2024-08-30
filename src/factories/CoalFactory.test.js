import * as utils from '../utils'
import { coal, stone } from '../data/ores'

import CoalFactory from './CoalFactory'

describe('CoalFactory', () => {
  beforeEach(() => {
    vitest.spyOn(utils, 'chooseRandom')
  })

  describe('generate', () => {
    let coalFactory

    beforeEach(() => {
      coalFactory = new CoalFactory()
    })

    test('it produces at least one coal and one stone', () => {
      utils.chooseRandom.mockReturnValueOnce(1)
      const resources = coalFactory.generate()

      expect(resources).toEqual([coal, stone])
    })

    test('can produce more than one coal and stone', () => {
      utils.chooseRandom.mockReturnValueOnce(3)
      const resources = coalFactory.generate()

      expect(resources.length > 2).toEqual(true)
      expect(resources[0]).toEqual(coal)
      expect(resources[resources.length - 1]).toEqual(stone)
    })
  })
})
