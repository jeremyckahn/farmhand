import { testState } from '../../test-utils/index.js'
import { fertilizerType, fieldMode } from '../../enums.js'

import { fertilizeForestPlot } from './fertilizeForestPlot.js'

vitest.mock('../../data/maps.js')

describe('fertilizeForestPlot', () => {
  describe('no fertilizer in inventory', () => {
    test('no-ops', () => {
      const oldState = testState({
        forest: [
          [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 0 }],
        ],
        inventory: [],
        selectedItemId: 'fertilizer',
      })
      const state = fertilizeForestPlot(oldState, 0, 0)

      expect(state).toBe(oldState)
    })
  })

  describe('empty plot', () => {
    test('no-ops', () => {
      const oldState = testState({
        forest: [[null]],
        inventory: [{ id: 'fertilizer', quantity: 1 }],
        selectedItemId: 'fertilizer',
      })
      const state = fertilizeForestPlot(oldState, 0, 0)

      expect(state).toBe(oldState)
    })
  })

  describe('non-tree plot content', () => {
    test('no-ops', () => {
      const oldState = testState({
        forest: [[{ forageableId: 'mushroom', daysOld: 0 }]],
        inventory: [{ id: 'fertilizer', quantity: 1 }],
        selectedItemId: 'fertilizer',
      })
      const state = fertilizeForestPlot(oldState, 0, 0)

      expect(state).toBe(oldState)
    })
  })

  describe('already-fertilized tree', () => {
    test('no-ops', () => {
      const oldState = testState({
        forest: [
          [
            {
              itemId: 'sample-tree-1',
              daysOld: 3,
              daysSinceLastHarvest: 0,
              fertilizerType: fertilizerType.STANDARD,
            },
          ],
        ],
        inventory: [{ id: 'fertilizer', quantity: 1 }],
        selectedItemId: 'fertilizer',
      })
      const state = fertilizeForestPlot(oldState, 0, 0)

      expect(state).toBe(oldState)
    })
  })

  describe('unfertilized tree', () => {
    describe('happy path', () => {
      test('fertilizes the tree with standard fertilizer', () => {
        const state = fertilizeForestPlot(
          testState({
            forest: [
              [
                {
                  itemId: 'sample-tree-1',
                  daysOld: 3,
                  daysSinceLastHarvest: 0,
                },
              ],
            ],
            inventory: [{ id: 'fertilizer', quantity: 1 }],
            selectedItemId: 'fertilizer',
          }),
          0,
          0
        )

        expect(state.forest[0][0]).toEqual({
          itemId: 'sample-tree-1',
          daysOld: 3,
          daysSinceLastHarvest: 0,
          fertilizerType: fertilizerType.STANDARD,
        })
        expect(state.inventory).toEqual([])
      })

      test('fertilizes the tree with rainbow fertilizer', () => {
        const state = fertilizeForestPlot(
          testState({
            forest: [
              [
                {
                  itemId: 'sample-tree-1',
                  daysOld: 3,
                  daysSinceLastHarvest: 0,
                },
              ],
            ],
            inventory: [{ id: 'rainbow-fertilizer', quantity: 1 }],
            selectedItemId: 'rainbow-fertilizer',
          }),
          0,
          0
        )

        expect(state.forest[0][0]).toEqual({
          itemId: 'sample-tree-1',
          daysOld: 3,
          daysSinceLastHarvest: 0,
          fertilizerType: fertilizerType.RAINBOW,
        })
        expect(state.inventory).toEqual([])
      })
    })

    describe('FERTILIZE field mode updating', () => {
      describe('multiple fertilizer units remaining', () => {
        test('does not change fieldMode', () => {
          const state = fertilizeForestPlot(
            testState({
              forest: [
                [
                  {
                    itemId: 'sample-tree-1',
                    daysOld: 3,
                    daysSinceLastHarvest: 0,
                  },
                ],
              ],
              inventory: [{ id: 'fertilizer', quantity: 2 }],
              selectedItemId: 'fertilizer',
            }),
            0,
            0
          )

          expect(state.fieldMode).toBe(fieldMode.FERTILIZE)
          expect(state.selectedItemId).toBe('fertilizer')
        })
      })

      describe('one fertilizer unit remaining', () => {
        test('changes fieldMode to OBSERVE', () => {
          const state = fertilizeForestPlot(
            testState({
              forest: [
                [
                  {
                    itemId: 'sample-tree-1',
                    daysOld: 3,
                    daysSinceLastHarvest: 0,
                  },
                ],
              ],
              inventory: [{ id: 'fertilizer', quantity: 1 }],
              selectedItemId: 'fertilizer',
            }),
            0,
            0
          )

          expect(state.fieldMode).toBe(fieldMode.OBSERVE)
          expect(state.selectedItemId).toBe('')
        })
      })
    })
  })
})
