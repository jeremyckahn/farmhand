import { testCrop } from '../../test-utils/index.js'
import {
  RAIN_MESSAGE,
  STORM_MESSAGE,
  STORM_DESTROYS_SCARECROWS_MESSAGE,
} from '../../strings.js'
import { SCARECROW_ITEM_ID } from '../../constants.js'
import { fertilizerType } from '../../enums.js'
import { getPlotContentFromItemId } from '../../utils/index.js'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.js'

import { applyPrecipitation } from './applyPrecipitation.js'

vitest.mock('../../data/maps.js')
vitest.mock('../../data/items.js')

describe('applyPrecipitation', () => {
  test('waters all plots', () => {
    const state = applyPrecipitation(
      saveDataStubFactory({
        field: [
          [
            testCrop({
              wasWateredToday: false,
            }),
            testCrop({
              wasWateredToday: false,
            }),
          ],
        ],
        inventory: [],
        newDayNotifications: [],
      })
    )

    expect(state.field[0][0]?.wasWateredToday).toBe(true)
    expect(state.field[0][1]?.wasWateredToday).toBe(true)
  })

  describe('rain shower', () => {
    test('waters all plots', () => {
      vitest.spyOn(Math, 'random').mockReturnValue(1)
      const state = applyPrecipitation(
        saveDataStubFactory({
          field: [[]],
          inventory: [],
          newDayNotifications: [],
        })
      )

      expect(state.newDayNotifications[0]).toEqual({
        message: RAIN_MESSAGE,
        severity: 'info',
      })
    })
  })

  describe('storm', () => {
    beforeEach(() => {
      vitest.spyOn(Math, 'random').mockReturnValue(0)
    })

    describe('scarecrows are planted', () => {
      test('scarecrows are destroyed', () => {
        const state = applyPrecipitation(
          saveDataStubFactory({
            field: [[getPlotContentFromItemId(SCARECROW_ITEM_ID)]],
            inventory: [],
            newDayNotifications: [],
          })
        )

        expect(state.field[0][0]).toBe(null)
        expect(state.newDayNotifications[0]).toEqual({
          message: STORM_DESTROYS_SCARECROWS_MESSAGE,
          severity: 'error',
        })
      })

      describe('scarecows are rainbow fertilized', () => {
        test('scarecrows are replaced based on available inventory', () => {
          const { field, inventory } = applyPrecipitation(
            saveDataStubFactory({
              field: [
                [
                  {
                    ...getPlotContentFromItemId(SCARECROW_ITEM_ID),
                    fertilizerType: fertilizerType.RAINBOW,
                  },
                  {
                    ...getPlotContentFromItemId(SCARECROW_ITEM_ID),
                    fertilizerType: fertilizerType.RAINBOW,
                  },
                ],
              ],
              inventory: [{ id: 'scarecrow', quantity: 1 }],
              newDayNotifications: [],
            })
          )

          // Scarecrow is replanted from inventory
          expect(field[0][0]).toEqual({
            ...getPlotContentFromItemId(SCARECROW_ITEM_ID),
            fertilizerType: fertilizerType.RAINBOW,
          })

          // Scarecrow replacement was not available
          expect(field[0][1]).toBe(null)

          // Scarecrow inventory is consumed
          expect(inventory).toEqual([])
        })
      })
    })

    describe('scarecrows are not planted', () => {
      test('shows appropriate message', () => {
        const state = applyPrecipitation(
          saveDataStubFactory({
            field: [[]],
            inventory: [],
            newDayNotifications: [],
          })
        )

        expect(state.newDayNotifications[0]).toEqual({
          message: STORM_MESSAGE,
          severity: 'info',
        })
      })
    })
  })
})
