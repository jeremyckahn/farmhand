import { itemType } from '../enums.js'

import OreFactory from './OreFactory.js'

describe('OreFactory', () => {
  beforeEach(() => {
    vitest.spyOn(global.Math, 'random')
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  describe('generate', () => {
    let oreFactory

    beforeEach(() => {
      oreFactory = new OreFactory()
    })

    test('it generates an ore', () => {
      const resources = oreFactory.generate()
      expect(resources[0].type).toEqual(itemType.ORE)
    })
  })
})
