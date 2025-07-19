import { testState, testItem } from '../../test-utils/index.js'

import { consumeIngredients } from './consumeIngredients.js'

describe('consumeIngredients', () => {
  describe('recipe with no ingredients', () => {
    test('returns state unchanged when recipe has no ingredients property', () => {
      const recipe = { id: 'test-recipe', name: 'Test Recipe' }
      const state = testState({
        inventory: [testItem({ id: 'sample-item', quantity: 5 })],
        experience: 100,
      })

      const result = consumeIngredients(state, recipe, 1, 50)

      expect(result).toEqual({
        ...state,
        experience: 150,
      })
    })

    test('returns state unchanged when recipe has empty ingredients', () => {
      const recipe = { id: 'test-recipe', name: 'Test Recipe', ingredients: {} }
      const state = testState({
        inventory: [testItem({ id: 'sample-item', quantity: 5 })],
        experience: 100,
      })

      const result = consumeIngredients(state, recipe, 1, 50)

      expect(result).toEqual({
        ...state,
        experience: 150,
      })
    })
  })

  describe('recipe with ingredients', () => {
    describe('insufficient ingredients', () => {
      test('returns state unchanged when cannot make recipe', () => {
        const recipe = {
          id: 'test-recipe',
          name: 'Test Recipe',
          ingredients: {
            'ingredient-1': 5,
            'ingredient-2': 3,
          },
        }
        const state = testState({
          inventory: [
            testItem({ id: 'ingredient-1', quantity: 2 }),
            testItem({ id: 'ingredient-2', quantity: 1 }),
          ],
          experience: 100,
        })

        const result = consumeIngredients(state, recipe, 1, 50)

        expect(result).toBe(state)
      })

      test('returns state unchanged when insufficient ingredients for multiple quantities', () => {
        const recipe = {
          id: 'test-recipe',
          name: 'Test Recipe',
          ingredients: {
            'ingredient-1': 2,
            'ingredient-2': 1,
          },
        }
        const state = testState({
          inventory: [
            testItem({ id: 'ingredient-1', quantity: 5 }),
            testItem({ id: 'ingredient-2', quantity: 1 }),
          ],
          experience: 100,
        })

        const result = consumeIngredients(state, recipe, 3, 50)

        expect(result).toBe(state)
      })
    })

    describe('sufficient ingredients', () => {
      test('processes ingredients for single recipe', () => {
        const recipe = {
          id: 'test-recipe',
          name: 'Test Recipe',
          ingredients: {
            'ingredient-1': 2,
            'ingredient-2': 1,
          },
        }
        const state = testState({
          inventory: [
            testItem({ id: 'ingredient-1', quantity: 5 }),
            testItem({ id: 'ingredient-2', quantity: 3 }),
            testItem({ id: 'other-item', quantity: 2 }),
          ],
          experience: 100,
        })

        const result = consumeIngredients(state, recipe, 1, 50)

        expect(result).toEqual({
          ...state,
          inventory: [
            testItem({ id: 'ingredient-1', quantity: 3 }),
            testItem({ id: 'ingredient-2', quantity: 2 }),
            testItem({ id: 'other-item', quantity: 2 }),
          ],
          experience: 150,
        })
      })

      test('processes ingredients for multiple recipes', () => {
        const recipe = {
          id: 'test-recipe',
          name: 'Test Recipe',
          ingredients: {
            'ingredient-1': 2,
            'ingredient-2': 1,
          },
        }
        const state = testState({
          inventory: [
            testItem({ id: 'ingredient-1', quantity: 8 }),
            testItem({ id: 'ingredient-2', quantity: 5 }),
          ],
          experience: 100,
        })

        const result = consumeIngredients(state, recipe, 3, 75)

        expect(result).toEqual({
          ...state,
          inventory: [
            testItem({ id: 'ingredient-1', quantity: 2 }),
            testItem({ id: 'ingredient-2', quantity: 2 }),
          ],
          experience: 175,
        })
      })

      test('removes ingredient completely when quantity reaches zero', () => {
        const recipe = {
          id: 'test-recipe',
          name: 'Test Recipe',
          ingredients: {
            'ingredient-1': 3,
            'ingredient-2': 2,
          },
        }
        const state = testState({
          inventory: [
            testItem({ id: 'ingredient-1', quantity: 3 }),
            testItem({ id: 'ingredient-2', quantity: 2 }),
            testItem({ id: 'other-item', quantity: 1 }),
          ],
          experience: 100,
        })

        const result = consumeIngredients(state, recipe, 1, 25)

        expect(result).toEqual({
          ...state,
          inventory: [testItem({ id: 'other-item', quantity: 1 })],
          experience: 125,
        })
      })

      test('handles single ingredient recipe', () => {
        const recipe = {
          id: 'test-recipe',
          name: 'Test Recipe',
          ingredients: {
            'ingredient-1': 4,
          },
        }
        const state = testState({
          inventory: [
            testItem({ id: 'ingredient-1', quantity: 10 }),
            testItem({ id: 'other-item', quantity: 2 }),
          ],
          experience: 10,
        })

        const result = consumeIngredients(state, recipe, 2, 25)

        expect(result).toEqual({
          ...state,
          inventory: [
            testItem({ id: 'ingredient-1', quantity: 2 }),
            testItem({ id: 'other-item', quantity: 2 }),
          ],
          experience: 35,
        })
      })
    })
  })

  describe('default parameters', () => {
    test('uses default howMany of 1', () => {
      const recipe = {
        id: 'test-recipe',
        name: 'Test Recipe',
        ingredients: {
          'ingredient-1': 2,
        },
      }
      const state = testState({
        inventory: [testItem({ id: 'ingredient-1', quantity: 5 })],
        experience: 100,
      })

      const result = consumeIngredients(state, recipe)

      expect(result).toEqual({
        ...state,
        inventory: [testItem({ id: 'ingredient-1', quantity: 3 })],
        experience: 100,
      })
    })

    test('uses default experiencePoints of 0', () => {
      const recipe = {
        id: 'test-recipe',
        name: 'Test Recipe',
        ingredients: {
          'ingredient-1': 1,
        },
      }
      const state = testState({
        inventory: [testItem({ id: 'ingredient-1', quantity: 3 })],
        experience: 100,
      })

      const result = consumeIngredients(state, recipe, 2)

      expect(result).toEqual({
        ...state,
        inventory: [testItem({ id: 'ingredient-1', quantity: 1 })],
        experience: 100,
      })
    })
  })

  describe('experience handling', () => {
    test('adds experience when no ingredients are required', () => {
      const recipe = { id: 'test-recipe', name: 'Test Recipe' }
      const state = testState({ experience: 0 })

      const result = consumeIngredients(state, recipe, 1, 100)

      expect(result.experience).toBe(100)
    })

    test('adds experience when ingredients are processed', () => {
      const recipe = {
        id: 'test-recipe',
        name: 'Test Recipe',
        ingredients: { 'ingredient-1': 1 },
      }
      const state = testState({
        inventory: [testItem({ id: 'ingredient-1', quantity: 2 })],
        experience: 50,
      })

      const result = consumeIngredients(state, recipe, 1, 75)

      expect(result.experience).toBe(125)
    })

    test('does not add experience when ingredients are insufficient', () => {
      const recipe = {
        id: 'test-recipe',
        name: 'Test Recipe',
        ingredients: { 'ingredient-1': 5 },
      }
      const state = testState({
        inventory: [testItem({ id: 'ingredient-1', quantity: 2 })],
        experience: 50,
      })

      const result = consumeIngredients(state, recipe, 1, 75)

      expect(result.experience).toBe(50)
    })
  })

  describe('edge cases', () => {
    test('handles empty inventory', () => {
      const recipe = {
        id: 'test-recipe',
        name: 'Test Recipe',
        ingredients: { 'ingredient-1': 1 },
      }
      const state = testState({
        inventory: [],
        experience: 100,
      })

      const result = consumeIngredients(state, recipe, 1, 50)

      expect(result).toBe(state)
    })

    test('handles recipe with ingredient not in inventory', () => {
      const recipe = {
        id: 'test-recipe',
        name: 'Test Recipe',
        ingredients: { 'nonexistent-ingredient': 1 },
      }
      const state = testState({
        inventory: [testItem({ id: 'other-item', quantity: 5 })],
        experience: 100,
      })

      const result = consumeIngredients(state, recipe, 1, 50)

      expect(result).toBe(state)
    })

    test('handles zero howMany parameter', () => {
      const recipe = {
        id: 'test-recipe',
        name: 'Test Recipe',
        ingredients: { 'ingredient-1': 2 },
      }
      const state = testState({
        inventory: [testItem({ id: 'ingredient-1', quantity: 5 })],
        experience: 100,
      })

      const result = consumeIngredients(state, recipe, 0, 50)

      expect(result).toEqual({
        ...state,
        experience: 150,
      })
    })

    test('handles negative experiencePoints parameter', () => {
      const recipe = {
        id: 'test-recipe',
        name: 'Test Recipe',
        ingredients: { 'ingredient-1': 1 },
      }
      const state = testState({
        inventory: [testItem({ id: 'ingredient-1', quantity: 2 })],
        experience: 100,
      })

      const result = consumeIngredients(state, recipe, 1, -25)

      expect(result).toEqual({
        ...state,
        inventory: [testItem({ id: 'ingredient-1', quantity: 1 })],
        experience: 75,
      })
    })
  })
})
