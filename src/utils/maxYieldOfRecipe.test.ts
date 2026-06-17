import {
    cropLifeStage
} from '../enums.js'

import {
    maxYieldOfRecipe
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


describe('maxYieldOfRecipe', () => {
  test('returns yield for no ingredients', () => {
    expect(
      maxYieldOfRecipe({ ingredients: { 'sample-item-1': 2 } } as any, [])
    ).toEqual(0)
  })

  test('returns yield for some ingredients', () => {
    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } } as any,
        [{ id: 'sample-item-1', quantity: 2 }]
      )
    ).toEqual(0)

    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } } as any,
        [
          { id: 'sample-item-1', quantity: 1 },
          { id: 'sample-item-2', quantity: 2 },
        ]
      )
    ).toEqual(0)

    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } } as any,
        [
          { id: 'sample-item-1', quantity: 4 },
          { id: 'sample-item-2', quantity: 3 },
        ]
      )
    ).toEqual(1)
  })

  test('returns yield for all ingredients', () => {
    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } } as any,
        [
          { id: 'sample-item-1', quantity: 2 },
          { id: 'sample-item-2', quantity: 2 },
        ]
      )
    ).toEqual(1)

    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } } as any,
        [
          { id: 'sample-item-1', quantity: 4 },
          { id: 'sample-item-2', quantity: 4 },
        ]
      )
    ).toEqual(2)
  })
})
