import { maxYieldOfRecipe } from './maxYieldOfRecipe.js'

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
