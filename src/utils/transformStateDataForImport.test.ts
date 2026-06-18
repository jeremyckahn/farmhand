import { carrot } from '../data/items.js'
import { getCowStub } from '../test-utils/stubs/cowStub.js'

import { transformStateDataForImport } from './transformStateDataForImport.js'

describe('transformStateDataForImport', () => {
  let state: Partial<farmhand.state>

  beforeEach(() => {
    state = {
      dayCount: 100,
      experience: 10,
      inventoryLimit: 1000,
      loanBalance: 100,
      money: 1234,
      version: '1',
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      cowInventory: [],
    }
  })

  test('it returns a sanitized state without version', () => {
    const sanitizedState = transformStateDataForImport(state as any)
    const { version, ...stateWithoutVersion } = state

    expect(sanitizedState).toEqual(stateWithoutVersion)
  })

  test('it calculates experience from itemsSold if experience is 0', () => {
    state.experience = 0
    state.itemsSold = {
      carrot: 5,
      'carrot-seed': 10,
    }

    const sanitizedState = transformStateDataForImport(state as any)
    const { version, ...stateWithoutVersion } = state

    expect(sanitizedState).toEqual({
      ...stateWithoutVersion,
      experience: 5,
    })
  })

  test.each([
    // Valid state, no cowBreedingPen changes needed
    {
      cowBreedingPen: { cowId1: 'abc', cowId2: null, daysUntilBirth: 2 },
      cowInventory: [getCowStub({ id: 'abc' })],
      expectedCowBreedingPen: {
        cowId1: 'abc',
        cowId2: null,
        daysUntilBirth: 2,
      },
    },

    // Valid state, no cowBreedingPen changes needed
    {
      cowBreedingPen: { cowId1: 'abc', cowId2: 'def', daysUntilBirth: 2 },
      cowInventory: [getCowStub({ id: 'def' }), getCowStub({ id: 'abc' })],
      expectedCowBreedingPen: {
        cowId1: 'abc',
        cowId2: 'def',
        daysUntilBirth: 2,
      },
    },

    // Invalid state, cowBreedingPen needs to be fixed
    {
      cowBreedingPen: { cowId1: 'abc', cowId2: 'def', daysUntilBirth: 2 },
      cowInventory: [],
      expectedCowBreedingPen: {
        cowId1: null,
        cowId2: null,
        daysUntilBirth: -1,
      },
    },

    // Invalid state, cowBreedingPen needs to be fixed
    {
      cowBreedingPen: { cowId1: 'abc', cowId2: null, daysUntilBirth: 2 },
      cowInventory: [],
      expectedCowBreedingPen: {
        cowId1: null,
        cowId2: null,
        daysUntilBirth: -1,
      },
    },
  ])(
    'fixes corrupt cowBreedingPen if needed',
    ({ cowBreedingPen, cowInventory, expectedCowBreedingPen }) => {
      Object.assign(state, { cowBreedingPen, cowInventory })

      const sanitizedState = transformStateDataForImport(state as any)
      const { version, ...stateWithoutVersion } = state

      expect(sanitizedState).toEqual({
        ...stateWithoutVersion,
        cowBreedingPen: expectedCowBreedingPen,
      })
    }
  )
})
