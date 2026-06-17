import {
    cropLifeStage
} from '../enums.js'

import {
    canMakeRecipe
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


describe('canMakeRecipe', () => {
  describe('player does not have sufficient ingredients', () => {
    test('evaluates inventory correctly', () => {
      expect(
        canMakeRecipe(
          { ingredients: { 'sample-item-1': 2 } } as any,
          [{ id: 'sample-item-1', quantity: 1 }],
          1
        )
      ).toBe(false)
    })
  })

  describe('player does have sufficient ingredients', () => {
    test('evaluates inventory correctly', () => {
      expect(
        canMakeRecipe(
          { ingredients: { 'sample-item-1': 2 } } as any,
          [{ id: 'sample-item-1', quantity: 2 }],
          1
        )
      ).toBe(true)
    })
  })
})
