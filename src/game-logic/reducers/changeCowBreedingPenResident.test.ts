import { COW_GESTATION_PERIOD_DAYS } from '../../constants.js'
import { generateCow } from '../../utils/index.js'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.js'

import { changeCowBreedingPenResident } from './changeCowBreedingPenResident.js'

const cowA = generateCow({ id: 'cow-a' })
const cowB = generateCow({ id: 'cow-b' })
const cowC = generateCow({ id: 'cow-c' })

describe('changeCowBreedingPenResident', () => {
  describe('doAdd === false', () => {
    describe('cow is not in breeding pen', () => {
      test('no-ops', () => {
        const inputState = saveDataStubFactory({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
          cowInventory: [cowA, cowB, cowC],
        })

        const state = changeCowBreedingPenResident(inputState, cowC, false)

        expect(state).toBe(inputState)
      })
    })

    describe('cow is in position 1', () => {
      test('cow is removed', () => {
        const state = changeCowBreedingPenResident(
          saveDataStubFactory({
            cowBreedingPen: {
              cowId1: 'cow-a',
              cowId2: 'cow-b',
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
            cowInventory: [cowA, cowB],
          }),
          cowA,
          false
        )

        expect(state.cowBreedingPen).toEqual({
          cowId1: 'cow-b',
          cowId2: null,
          daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
        })

        expect(state.cowInventory).toEqual([cowA, cowB])
      })
    })

    describe('cow is in position 2', () => {
      test('cow is removed', () => {
        const state = changeCowBreedingPenResident(
          saveDataStubFactory({
            cowBreedingPen: {
              cowId1: 'cow-a',
              cowId2: 'cow-b',
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
            cowInventory: [cowA, cowB],
          }),
          cowB,
          false
        )

        expect(state.cowBreedingPen).toEqual({
          cowId1: 'cow-a',
          cowId2: null,
          daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
        })

        expect(state.cowInventory).toEqual([cowA, cowB])
      })
    })
  })

  describe('doAdd === true', () => {
    describe('cow is in breeding pen', () => {
      test('no-ops', () => {
        const inputState = saveDataStubFactory({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
          cowInventory: [cowA, cowB],
        })

        const state = changeCowBreedingPenResident(inputState, cowA, true)

        expect(state).toBe(inputState)
      })
    })

    describe('cow is not in inventory', () => {
      test('no-ops', () => {
        const inputState = saveDataStubFactory({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: null,
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
          cowInventory: [cowA],
        })

        const state = changeCowBreedingPenResident(inputState, cowB, true)

        expect(state).toBe(inputState)
      })
    })

    describe('breeding pen is full', () => {
      test('no-ops', () => {
        const inputState = saveDataStubFactory({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
          cowInventory: [cowA, cowB],
        })

        const state = changeCowBreedingPenResident(inputState, cowC, true)

        expect(state).toBe(inputState)
      })
    })

    describe('there are no cows in breeding pen', () => {
      test('cow is added to first slot', () => {
        const state = changeCowBreedingPenResident(
          saveDataStubFactory({
            cowBreedingPen: {
              cowId1: null,
              cowId2: null,
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
            cowInventory: [cowA, cowB],
          }),
          cowA,
          true
        )

        expect(state.cowBreedingPen).toEqual({
          cowId1: 'cow-a',
          cowId2: null,
          daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
        })

        expect(state.cowInventory).toEqual([cowA, cowB])
      })
    })

    describe('there is one cow in breeding pen', () => {
      test('cow is added to second slot', () => {
        const state = changeCowBreedingPenResident(
          saveDataStubFactory({
            cowBreedingPen: {
              cowId1: 'cow-a',
              cowId2: null,
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
            cowInventory: [cowA, cowB],
          }),
          cowB,
          true
        )

        expect(state.cowBreedingPen).toEqual({
          cowId1: 'cow-a',
          cowId2: 'cow-b',
          daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
        })

        expect(state.cowInventory).toEqual([cowA, cowB])
      })
    })
  })
})
