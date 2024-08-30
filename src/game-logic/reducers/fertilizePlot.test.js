import { testCrop, testItem } from '../../test-utils'
import { fertilizerType, fieldMode } from '../../enums'
import { getPlotContentFromItemId } from '../../utils'

import { fertilizePlot } from './fertilizePlot'

vitest.mock('../../data/maps')

describe('fertilizePlot', () => {
  describe('no fertilizer in inventory', () => {
    test('no-ops', () => {
      const oldState = {
        field: [[testCrop({ itemId: 'sample-crop-1' })]],
        inventory: [],
        selectedItemId: 'fertilizer',
      }
      const state = fertilizePlot(oldState, 0, 0)
      expect(state).toBe(oldState)
    })
  })

  describe('non-crop plotContent', () => {
    describe('plotContent is a sprinkler', () => {
      test('no-ops with standard fertilizer', () => {
        const oldState = {
          field: [[getPlotContentFromItemId('sprinkler')]],
          inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
          selectedItemId: 'fertilizer',
        }
        const state = fertilizePlot(oldState, 0, 0)
        expect(state).toBe(oldState)
      })

      test('no-ops with rainbow fertilizer', () => {
        const oldState = {
          field: [[getPlotContentFromItemId('sprinkler')]],
          inventory: [testItem({ id: 'rainbow-fertilizer', quantity: 1 })],
          selectedItemId: 'rainbow-fertilizer',
        }
        const state = fertilizePlot(oldState, 0, 0)
        expect(state).toBe(oldState)
      })
    })

    describe('plotContent is a scarecrow', () => {
      test('no-ops with standard fertilizer', () => {
        const oldState = {
          field: [[getPlotContentFromItemId('scarecrow')]],
          inventory: [],
          selectedItemId: 'fertilizer',
        }
        const state = fertilizePlot(oldState, 0, 0)
        expect(state).toBe(oldState)
      })

      test('fertilizes with rainbow fertilizer', () => {
        const state = fertilizePlot(
          {
            field: [[getPlotContentFromItemId('scarecrow')]],
            inventory: [testItem({ id: 'rainbow-fertilizer', quantity: 1 })],
            selectedItemId: 'rainbow-fertilizer',
          },
          0,
          0
        )

        expect(state.field[0][0]).toEqual({
          ...getPlotContentFromItemId('scarecrow'),
          fertilizerType: fertilizerType.RAINBOW,
        })
        expect(state.inventory).toEqual([])
      })
    })
  })

  describe('unfertilized crops', () => {
    describe('happy path', () => {
      test('fertilizes crop with standard fertilizer', () => {
        const state = fertilizePlot(
          {
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
            selectedItemId: 'fertilizer',
          },
          0,
          0
        )

        expect(state.field[0][0]).toEqual(
          testCrop({
            itemId: 'sample-crop-1',
            fertilizerType: fertilizerType.STANDARD,
          })
        )
        expect(state.inventory).toEqual([])
      })

      test('fertilizes crop with rainbow fertilizer', () => {
        const state = fertilizePlot(
          {
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            inventory: [testItem({ id: 'rainbow-fertilizer', quantity: 1 })],
            selectedItemId: 'rainbow-fertilizer',
          },
          0,
          0
        )

        expect(state.field[0][0]).toEqual(
          testCrop({
            itemId: 'sample-crop-1',
            fertilizerType: fertilizerType.RAINBOW,
          })
        )
        expect(state.inventory).toEqual([])
      })
    })

    describe('FERTILIZE field mode updating', () => {
      describe('multiple fertilizer units remaining', () => {
        test('does not change fieldMode', () => {
          const state = fertilizePlot(
            {
              field: [[testCrop({ itemId: 'sample-crop-1' })]],
              inventory: [testItem({ id: 'fertilizer', quantity: 2 })],
              selectedItemId: 'fertilizer',
            },
            0,
            0
          )

          expect(state.fieldMode).toBe(fieldMode.FERTILIZE)
          expect(state.selectedItemId).toBe('fertilizer')
        })
      })

      describe('one fertilizer unit remaining', () => {
        test('changes fieldMode to OBSERVE', () => {
          const state = fertilizePlot(
            {
              field: [[testCrop({ itemId: 'sample-crop-1' })]],
              inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
              selectedItemId: 'fertilizer',
            },
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
