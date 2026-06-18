import { carrot, pumpkin, spinach, corn, potato, wheat } from '../data/items.js'

import { computeMarketPositions } from './computeMarketPositions.js'

describe('computeMarketPositions', () => {
  test('computes day positions', () => {
    expect(
      computeMarketPositions(
        { [carrot.id]: 10, [pumpkin.id]: 5, [spinach.id]: 0 },
        {},
        [
          { id: carrot.id, quantity: 5 },
          { id: pumpkin.id, quantity: 10 },
          { id: spinach.id, quantity: 0 },
          { id: corn.id, quantity: 10 },
        ]
      )
    ).toEqual({
      [carrot.id]: -1,
      [pumpkin.id]: 1,
      [corn.id]: 1,
    })

    expect(
      computeMarketPositions(
        {},
        { [carrot.id]: 10, [pumpkin.id]: 5, [spinach.id]: 0 },
        [
          { id: carrot.id, quantity: 5 },
          { id: pumpkin.id, quantity: 10 },
          { id: spinach.id, quantity: 0 },
          { id: corn.id, quantity: 10 },
        ]
      )
    ).toEqual({
      [carrot.id]: -1,
      [pumpkin.id]: 1,
      [corn.id]: 1,
    })

    expect(
      computeMarketPositions(
        {
          [carrot.id]: 5,
          [pumpkin.id]: 5,
          [spinach.id]: 5,
          [corn.id]: 0,
          [potato.id]: 10,
        },
        {
          [carrot.id]: 10,
          [pumpkin.id]: 5,
          [spinach.id]: 0,
          [potato.id]: 5,
          [wheat.id]: 10,
        },
        [
          { id: carrot.id, quantity: 5 },
          { id: pumpkin.id, quantity: 10 },
          { id: spinach.id, quantity: 0 },
          { id: corn.id, quantity: 0 },
          { id: potato.id, quantity: 5 },
          { id: wheat.id, quantity: 5 },
        ]
      )
    ).toEqual({
      [pumpkin.id]: 1,
      [spinach.id]: -1,
      [potato.id]: -1,
      [wheat.id]: -1,
    })
  })
})
