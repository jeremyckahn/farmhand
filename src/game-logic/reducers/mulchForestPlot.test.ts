import { testState } from '../../test-utils/index.js'
import { fertilizerType, fieldMode } from '../../enums.js'

import { mulchForestPlot } from './mulchForestPlot.js'

vitest.mock('../../data/maps.js')

describe('mulchForestPlot', () => {
  describe('no mulch in inventory', () => {
    test('no-ops', () => {
      const oldState = testState({
        forest: [
          [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 0 }],
        ],
        inventory: [],
        selectedItemId: 'mulch',
      })
      const state = mulchForestPlot(oldState, 0, 0)

      expect(state).toBe(oldState)
    })
  })

  describe('empty plot', () => {
    test('no-ops', () => {
      const oldState = testState({
        forest: [[null]],
        inventory: [{ id: 'mulch', quantity: 1 }],
        selectedItemId: 'mulch',
      })
      const state = mulchForestPlot(oldState, 0, 0)

      expect(state).toBe(oldState)
    })
  })

  describe('non-tree plot content', () => {
    test('no-ops', () => {
      const oldState = testState({
        forest: [[{ forageableId: 'mushroom', daysOld: 0 }]],
        inventory: [{ id: 'mulch', quantity: 1 }],
        selectedItemId: 'mulch',
      })
      const state = mulchForestPlot(oldState, 0, 0)

      expect(state).toBe(oldState)
    })
  })

  describe('already-mulched tree', () => {
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
        inventory: [{ id: 'mulch', quantity: 1 }],
        selectedItemId: 'mulch',
      })
      const state = mulchForestPlot(oldState, 0, 0)

      expect(state).toBe(oldState)
    })
  })

  describe('unmulched tree', () => {
    describe('happy path', () => {
      test('mulches the tree with standard mulch', () => {
        const state = mulchForestPlot(
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
            inventory: [{ id: 'mulch', quantity: 1 }],
            selectedItemId: 'mulch',
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

      test('mulches the tree with rainbow mulch', () => {
        const state = mulchForestPlot(
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
            inventory: [{ id: 'rainbow-mulch', quantity: 1 }],
            selectedItemId: 'rainbow-mulch',
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

    describe('mulchApplied', () => {
      test('increments the count for the applied mulch type', () => {
        const state = mulchForestPlot(
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
            inventory: [{ id: 'mulch', quantity: 1 }],
            selectedItemId: 'mulch',
            mulchApplied: { mulch: 1 },
          }),
          0,
          0
        )

        expect(state.mulchApplied).toEqual({ mulch: 2 })
      })
    })

    describe('FERTILIZE field mode updating', () => {
      describe('multiple mulch units remaining', () => {
        test('does not change fieldMode', () => {
          const state = mulchForestPlot(
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
              inventory: [{ id: 'mulch', quantity: 2 }],
              selectedItemId: 'mulch',
            }),
            0,
            0
          )

          expect(state.fieldMode).toBe(fieldMode.FERTILIZE)
          expect(state.selectedItemId).toBe('mulch')
        })
      })

      describe('one mulch unit remaining', () => {
        test('changes fieldMode to OBSERVE', () => {
          const state = mulchForestPlot(
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
              inventory: [{ id: 'mulch', quantity: 1 }],
              selectedItemId: 'mulch',
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
