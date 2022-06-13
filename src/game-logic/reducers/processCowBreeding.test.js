import {
  COW_GESTATION_PERIOD_DAYS,
  PURCHASEABLE_COW_PENS,
} from '../../constants'
import { genders } from '../../enums'
import { generateCow } from '../../utils'

import { processCowBreeding } from './processCowBreeding'

describe('processCowBreeding', () => {
  const maleCow1 = generateCow({ gender: genders.MALE, happiness: 1 })
  const maleCow2 = generateCow({ gender: genders.MALE, happiness: 1 })
  const femaleCow = generateCow({ gender: genders.FEMALE, happiness: 1 })

  describe('there are less than two cows in breeding pen', () => {
    test('no-ops', () => {
      const inputState = {
        cowBreedingPen: {
          cowId1: maleCow1.id,
          cowId2: null,
          daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
        },
        cowInventory: [maleCow1],
        newDayNotifications: [],
        purchasedCowPen: 1,
      }

      const state = processCowBreeding(inputState)

      expect(state).toBe(inputState)
    })
  })

  describe('there are two cows in breeding pen', () => {
    describe('cows are same gender', () => {
      test('no-ops', () => {
        const inputState = {
          cowBreedingPen: {
            cowId1: maleCow1.id,
            cowId2: maleCow2.id,
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
          cowInventory: [maleCow1, maleCow2],
          newDayNotifications: [],
          purchasedCowPen: 1,
        }

        const state = processCowBreeding(inputState)

        expect(state).toBe(inputState)
      })
    })

    describe('cows are opposite gender', () => {
      describe('at least one cow does not meet happiness requirement', () => {
        test('resets daysUntilBirth', () => {
          const {
            cowBreedingPen: { daysUntilBirth },
          } = processCowBreeding({
            cowBreedingPen: {
              cowId1: maleCow1.id,
              cowId2: femaleCow.id,
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS - 1,
            },
            cowInventory: [
              generateCow({ ...maleCow1, happiness: 0 }),
              femaleCow,
            ],
            newDayNotifications: [],
            purchasedCowPen: 1,
          })

          expect(daysUntilBirth).toEqual(COW_GESTATION_PERIOD_DAYS)
        })
      })

      describe('both cows meet happiness requirement', () => {
        describe('daysUntilBirth > 1', () => {
          test('decrements daysUntilBirth', () => {
            const {
              cowBreedingPen: { daysUntilBirth },
            } = processCowBreeding({
              cowBreedingPen: {
                cowId1: maleCow1.id,
                cowId2: femaleCow.id,
                daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
              },
              cowInventory: [maleCow1, femaleCow],
              newDayNotifications: [],
              purchasedCowPen: 1,
            })

            expect(daysUntilBirth).toEqual(COW_GESTATION_PERIOD_DAYS - 1)
          })
        })

        describe('daysUntilBirth === 1', () => {
          describe('there is space in cowInventory', () => {
            test('adds offspring cow to cowInventory', () => {
              const { cowInventory } = processCowBreeding({
                cowBreedingPen: {
                  cowId1: maleCow1.id,
                  cowId2: femaleCow.id,
                  daysUntilBirth: 1,
                },
                cowInventory: [maleCow1, femaleCow],
                newDayNotifications: [],
                purchasedCowPen: 1,
              })

              expect(cowInventory).toHaveLength(3)
            })
          })

          describe('there is no space in cowInventory', () => {
            test('offspring cow is not added to cowInventory', () => {
              const { cowInventory } = processCowBreeding({
                cowBreedingPen: {
                  cowId1: maleCow1.id,
                  cowId2: femaleCow.id,
                  daysUntilBirth: 1,
                },
                cowInventory: [
                  maleCow1,
                  femaleCow,
                  ...new Array(PURCHASEABLE_COW_PENS.get(1).cows - 2)
                    .fill(null)
                    .map(() => generateCow()),
                ],
                newDayNotifications: [],
                purchasedCowPen: 1,
              })

              expect(cowInventory).toHaveLength(
                PURCHASEABLE_COW_PENS.get(1).cows
              )
            })
          })

          test('resets daysUntilBirth', () => {
            const {
              cowBreedingPen: { daysUntilBirth },
            } = processCowBreeding({
              cowBreedingPen: {
                cowId1: maleCow1.id,
                cowId2: femaleCow.id,
                daysUntilBirth: 1,
              },
              cowInventory: [maleCow1, femaleCow],
              newDayNotifications: [],
              purchasedCowPen: 1,
            })

            expect(daysUntilBirth).toEqual(COW_GESTATION_PERIOD_DAYS)
          })
        })
      })
    })
  })
})
