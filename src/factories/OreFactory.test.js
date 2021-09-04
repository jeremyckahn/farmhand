import { itemType } from '../enums'

import OreFactory from './OreFactory'

describe('OreFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterEach(() => {
    jest.restoreAllMocks()
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
