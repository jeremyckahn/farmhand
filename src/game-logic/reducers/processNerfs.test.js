import { testCrop } from '../../test-utils'
import { CROW_ATTACKED } from '../../templates'
import { SCARECROW_ITEM_ID } from '../../constants'
import { itemsMap } from '../../data/maps'
import { getPlotContentFromItemId } from '../../utils'

import { processNerfs } from './processNerfs'

jest.mock('../../data/maps')

describe('processNerfs', () => {
  describe('crows', () => {
    describe('crows do not attack', () => {
      test('crop is safe', () => {
        const state = processNerfs({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
          newDayNotifications: [],
        })

        expect(state.field[0][0]).toEqual(testCrop({ itemId: 'sample-crop-1' }))
        expect(state.newDayNotifications).toEqual([])
      })
    })

    describe('crows attack', () => {
      test('crop is destroyed', () => {
        jest.resetModules()
        jest.mock('../../constants', () => ({
          CROW_CHANCE: 1,
        }))

        const { processNerfs } = jest.requireActual('./processNerfs')
        const state = processNerfs({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
          newDayNotifications: [],
        })

        expect(state.field[0][0]).toBe(null)
        expect(state.newDayNotifications).toEqual([
          {
            message: CROW_ATTACKED`${itemsMap['sample-crop-1']}`,
            severity: 'error',
          },
        ])
      })

      test('multiple messages are grouped', () => {
        jest.resetModules()
        jest.mock('../../constants', () => ({
          CROW_CHANCE: 1,
        }))

        const { processNerfs } = jest.requireActual('./processNerfs')
        const state = processNerfs({
          field: [
            [
              testCrop({ itemId: 'sample-crop-1' }),
              testCrop({ itemId: 'sample-crop-2' }),
            ],
          ],
          newDayNotifications: [],
        })

        expect(state.field[0][0]).toBe(null)
        expect(state.newDayNotifications).toEqual([
          {
            message: [
              CROW_ATTACKED`${itemsMap['sample-crop-1']}`,
              CROW_ATTACKED`${itemsMap['sample-crop-2']}`,
            ].join('\n\n'),
            severity: 'error',
          },
        ])
      })

      describe('there is a scarecrow', () => {
        test('crow attack is prevented', () => {
          jest.resetModules()
          jest.mock('../../constants', () => ({
            CROW_CHANCE: 1,
            SCARECROW_ITEM_ID: 'scarecrow',
          }))

          const { processNerfs } = jest.requireActual('./processNerfs')
          const state = processNerfs({
            field: [
              [
                testCrop({ itemId: 'sample-crop-1' }),
                getPlotContentFromItemId(SCARECROW_ITEM_ID),
              ],
            ],
            newDayNotifications: [],
          })

          expect(state.field[0][0]).toEqual(
            testCrop({ itemId: 'sample-crop-1' })
          )
          expect(state.newDayNotifications).toEqual([])
        })
      })
    })
  })
})
