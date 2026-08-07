import { testCrop } from '../../test-utils/index.js'
import {
  RAIN_MESSAGE,
  STORM_MESSAGE,
  STORM_DESTROYS_SCARECROWS_MESSAGE,
  LIGHTNING_ROD_STRUCK_MESSAGE,
  LIGHTNING_ROD_DESTROYED_MESSAGE,
  LIGHTNING_ROD_REPLANTED_MESSAGE,
} from '../../strings.js'
import { SCARECROW_ITEM_ID } from '../../constants.js'
import { fertilizerType } from '../../enums.js'
import { getPlotContentFromItemId } from '../../utils/getPlotContentFromItemId.js'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.js'

import { applyPrecipitation } from './applyPrecipitation.js'

const LIGHTNING_ROD_ITEM_ID = 'sample-lightning-rod-1'

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

    describe('lightning rod is planted', () => {
      describe('rod has not reached its strike capacity', () => {
        test('accumulates a strike and survives', () => {
          const state = applyPrecipitation(
            saveDataStubFactory({
              field: [
                [
                  {
                    itemId: LIGHTNING_ROD_ITEM_ID,
                    fertilizerType: fertilizerType.NONE,
                    lightningStrikesSustained: 0,
                  },
                ],
              ],
              inventory: [],
              newDayNotifications: [],
            })
          )

          expect(state.field[0][0]).toEqual({
            itemId: LIGHTNING_ROD_ITEM_ID,
            fertilizerType: fertilizerType.NONE,
            lightningStrikesSustained: 1,
          })
          expect(state.newDayNotifications[0]).toEqual({
            message: LIGHTNING_ROD_STRUCK_MESSAGE,
            severity: 'info',
          })
        })
      })

      describe('rod reaches its strike capacity', () => {
        test('is destroyed and refunds ore', () => {
          const state = applyPrecipitation(
            saveDataStubFactory({
              field: [
                [
                  {
                    itemId: LIGHTNING_ROD_ITEM_ID,
                    fertilizerType: fertilizerType.NONE,
                    lightningStrikesSustained: 1,
                  },
                ],
              ],
              inventory: [],
              newDayNotifications: [],
            })
          )

          expect(state.field[0][0]).toBe(null)
          expect(state.inventory).toEqual([{ id: 'sample-ore-1', quantity: 2 }])
          expect(state.newDayNotifications[0]).toEqual({
            message: LIGHTNING_ROD_DESTROYED_MESSAGE,
            severity: 'error',
          })
        })

        describe('rod is rainbow fertilized', () => {
          test('is replanted from inventory instead of being destroyed', () => {
            const state = applyPrecipitation(
              saveDataStubFactory({
                field: [
                  [
                    {
                      itemId: LIGHTNING_ROD_ITEM_ID,
                      fertilizerType: fertilizerType.RAINBOW,
                      lightningStrikesSustained: 1,
                    },
                  ],
                ],
                inventory: [{ id: LIGHTNING_ROD_ITEM_ID, quantity: 1 }],
                newDayNotifications: [],
              })
            )

            expect(state.field[0][0]).toEqual({
              itemId: LIGHTNING_ROD_ITEM_ID,
              fertilizerType: fertilizerType.RAINBOW,
              lightningStrikesSustained: 0,
            })
            expect(state.inventory).toEqual([])
            expect(state.newDayNotifications[0]).toEqual({
              message: LIGHTNING_ROD_REPLANTED_MESSAGE,
              severity: 'success',
            })
          })

          describe('no spare rod is available in inventory', () => {
            test('is destroyed and refunds ore as usual', () => {
              const state = applyPrecipitation(
                saveDataStubFactory({
                  field: [
                    [
                      {
                        itemId: LIGHTNING_ROD_ITEM_ID,
                        fertilizerType: fertilizerType.RAINBOW,
                        lightningStrikesSustained: 1,
                      },
                    ],
                  ],
                  inventory: [],
                  newDayNotifications: [],
                })
              )

              expect(state.field[0][0]).toBe(null)
              expect(state.inventory).toEqual([
                { id: 'sample-ore-1', quantity: 2 },
              ])
              expect(state.newDayNotifications[0]).toEqual({
                message: LIGHTNING_ROD_DESTROYED_MESSAGE,
                severity: 'error',
              })
            })
          })
        })
      })

      describe('multiple rods are planted', () => {
        test('randomly targets one of them', () => {
          // saveDataStubFactory runs the full day-end pipeline internally
          // (consuming an unpredictable number of Math.random() calls of
          // its own, e.g. for price fluctuations), so the stub state must
          // be built - under the beforeEach's constant 0 mock - before
          // installing a precise once-queue for the applyPrecipitation
          // call actually under test below.
          const inputState = saveDataStubFactory({
            field: [
              [
                {
                  itemId: LIGHTNING_ROD_ITEM_ID,
                  fertilizerType: fertilizerType.NONE,
                  lightningStrikesSustained: 0,
                },
                {
                  itemId: LIGHTNING_ROD_ITEM_ID,
                  fertilizerType: fertilizerType.NONE,
                  lightningStrikesSustained: 0,
                },
              ],
            ],
            inventory: [],
            newDayNotifications: [],
          })

          // First call is shouldStormToday()'s own roll - 0 guarantees a
          // storm regardless of STORM_CHANCE. Second call is the
          // rod-targeting roll: 0.9 selects index 1 of the 2 candidate
          // coordinates (Math.floor(0.9 * 2) === 1).
          vitest
            .spyOn(Math, 'random')
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.9)

          const state = applyPrecipitation(inputState)

          // The second of the two rod coordinates was struck - the first
          // is left completely untouched.
          expect(state.field[0][0]).toEqual({
            itemId: LIGHTNING_ROD_ITEM_ID,
            fertilizerType: fertilizerType.NONE,
            lightningStrikesSustained: 0,
          })
          expect(state.field[0][1]).toEqual({
            itemId: LIGHTNING_ROD_ITEM_ID,
            fertilizerType: fertilizerType.NONE,
            lightningStrikesSustained: 1,
          })
        })
      })

      describe('a scarecrow is also planted', () => {
        test('the scarecrow is protected instead of being destroyed', () => {
          const state = applyPrecipitation(
            saveDataStubFactory({
              field: [
                [
                  {
                    itemId: LIGHTNING_ROD_ITEM_ID,
                    fertilizerType: fertilizerType.NONE,
                    lightningStrikesSustained: 0,
                  },
                  getPlotContentFromItemId(SCARECROW_ITEM_ID),
                ],
              ],
              inventory: [],
              newDayNotifications: [],
            })
          )

          expect(state.field[0][1]).toEqual(
            getPlotContentFromItemId(SCARECROW_ITEM_ID)
          )
          expect(state.newDayNotifications[0]).toEqual({
            message: LIGHTNING_ROD_STRUCK_MESSAGE,
            severity: 'info',
          })
        })
      })
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
