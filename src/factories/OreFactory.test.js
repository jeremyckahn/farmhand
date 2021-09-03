import { itemType } from '../enums'

import OreFactory from './OreFactory'

describe('OreFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('does not spawn anything when dice roll is higher than spawn chance', () => {
    global.Math.random.mockImplementationOnce(() => 1)

    const ore = OreFactory.spawn()

    expect(ore).toEqual(null)
  })

  it('spawns a random ore', () => {
    global.Math.random
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0.001)

    const ore = OreFactory.spawn()

    expect([itemType.STONE, itemType.ORE].includes(ore.type)).toEqual(true)
  })

  it('returns null when no ore is spawned', () => {
    global.Math.random
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 1)

    const ore = OreFactory.spawn()

    expect(ore).toEqual(null)
  })
})
