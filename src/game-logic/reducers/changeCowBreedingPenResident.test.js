import { COW_GESTATION_PERIOD_DAYS } from '../../constants'
import { generateCow } from '../../utils'

import { changeCowBreedingPenResident } from './changeCowBreedingPenResident'

describe('changeCowBreedingPenResident', () => {
  describe('doAdd === false', () => {
    describe('cow is not in breeding pen', () => {
      test('no-ops', () => {
        const inputState = {
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        }

        const state = changeCowBreedingPenResident(
          inputState,
          generateCow({ id: 'cow-c' }),
          false
        )

        expect(state).toBe(inputState)
      })
    })

    describe('cow is in position 1', () => {
      test('cow is removed', () => {
        const state = changeCowBreedingPenResident(
          {
            cowBreedingPen: {
              cowId1: 'cow-a',
              cowId2: 'cow-b',
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
          },
          generateCow({ id: 'cow-a' }),
          false
        )

        expect(state).toEqual({
          cowBreedingPen: {
            cowId1: 'cow-b',
            cowId2: null,
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        })
      })
    })

    describe('cow is in position 2', () => {
      test('cow is removed', () => {
        const state = changeCowBreedingPenResident(
          {
            cowBreedingPen: {
              cowId1: 'cow-a',
              cowId2: 'cow-b',
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
          },
          generateCow({ id: 'cow-b' }),
          false
        )

        expect(state).toEqual({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: null,
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        })
      })
    })
  })

  describe('doAdd === true', () => {
    describe('cow is in breeding pen', () => {
      test('no-ops', () => {
        const inputState = {
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        }

        const state = changeCowBreedingPenResident(
          inputState,
          generateCow({ id: 'cow-a' }),
          true
        )

        expect(state).toBe(inputState)
      })
    })

    describe('breeding pen is full', () => {
      test('no-ops', () => {
        const inputState = {
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        }

        const state = changeCowBreedingPenResident(
          inputState,
          generateCow({ id: 'cow-c' }),
          true
        )

        expect(state).toBe(inputState)
      })
    })

    describe('there are no cows in breeding pen', () => {
      test('cow is added to first slot', () => {
        const state = changeCowBreedingPenResident(
          {
            cowBreedingPen: {
              cowId1: null,
              cowId2: null,
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
          },
          generateCow({ id: 'cow-a' }),
          true
        )

        expect(state).toEqual({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: null,
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        })
      })
    })

    describe('there is one cow in breeding pen', () => {
      test('cow is added to second slot', () => {
        const state = changeCowBreedingPenResident(
          {
            cowBreedingPen: {
              cowId1: 'cow-a',
              cowId2: null,
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
          },
          generateCow({ id: 'cow-b' }),
          true
        )

        expect(state).toEqual({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        })
      })
    })
  })
})
