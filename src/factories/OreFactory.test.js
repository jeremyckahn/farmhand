import { itemType } from '../enums'

import OreFactory from './OreFactory'

describe('OreFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('spawns a random ore', () => {
    global.Math.random.mockReturnValueOnce(0.001)

    const ore = OreFactory.spawn()

    expect(ore.type).toEqual(itemType.ORE)
  })

  it('returns null when no ore is spawned', () => {
    global.Math.random.mockReturnValueOnce(1)

    const ore = OreFactory.spawn()

    expect(ore).toEqual(null)
  })
})
