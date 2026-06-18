import { canMakeRecipe } from './canMakeRecipe.js'

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
