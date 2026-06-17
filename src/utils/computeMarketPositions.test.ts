import {
    carrot,
    corn,
    potato,
    pumpkin,
    spinach,
    wheat
} from '../data/items.js'
import {
    cropLifeStage
} from '../enums.js'

import {
    computeMarketPositions
} from './index.js'


const { SEED, GROWING, GROWN } = cropLifeStage

const percentageStringTests = [
  [0, '0%'],
  [0.5, '50%'],
  [1, '100%'],
  [1.5, '150%'],
  [2, '200%'],
]

const dollarStringTests = [
  [0, '$0.00'],
  [0.5, '$0.50'],
  [1, '$1.00'],
  [1.5, '$1.50'],
  [2, '$2.00'],
]

const integerStringTests = [
  [0, '0'],
  [0.5, '1'],
  [1, '1'],
  [1.5, '2'],
  [2, '2'],
]


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
