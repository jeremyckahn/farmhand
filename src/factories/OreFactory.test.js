import { itemType } from '../enums'

import OreFactory from './OreFactory'

describe('OreFactory', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('does not spawn anything when first dice roll is higher than spawn chance', () => {
    global.Math.random.mockImplementationOnce(() => 1)

    const ore = OreFactory.spawn()

    expect(ore).toEqual(null)
  })

  test('spawns a random ore when both dice rolls align', () => {
    global.Math.random
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0.001)

    const ore = OreFactory.spawn()

    expect(ore.type).toEqual(itemType.ORE)
  })
})
