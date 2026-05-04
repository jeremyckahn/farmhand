import { vi } from 'vitest'

import { coal, stone } from '../data/ores/index.js'
import * as utils from '../utils/index.js'

import CoalFactory from './CoalFactory.js'

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
      vi.mocked(utils.chooseRandom).mockReturnValueOnce(1)
      const resources = coalFactory.generate()

      expect(resources).toEqual([coal, stone])
    })

    test('can produce more than one coal and stone', () => {
      vi.mocked(utils.chooseRandom).mockReturnValueOnce(3)
      const resources = coalFactory.generate()

      expect(resources.length > 2).toEqual(true)
      expect(resources[0]).toEqual(coal)
      expect(resources[resources.length - 1]).toEqual(stone)
    })
  })
})
