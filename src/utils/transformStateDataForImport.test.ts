import { carrot } from '../data/items.js'
import { toolLevel, toolType } from '../enums.js'
import { getCowStub } from '../test-utils/stubs/cowStub.js'

import { transformStateDataForImport } from './transformStateDataForImport.js'

// The axe unlocks alongside the forest, which is gated behind this feature
// flag (see data/levels.ts) - force it on so getLevelEntitlements actually
// reports the axe as unlocked at high enough levels in these tests.
vitest.mock('../config.js', () => ({ features: { FOREST: true } }))

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

  test('backfills a missing AXE toolLevel to UNAVAILABLE when the player has not reached the unlock level yet', () => {
    state.experience = 10 // well below the level that unlocks the axe
    state.toolLevels = {
      SCYTHE: toolLevel.DEFAULT,
      SHOVEL: toolLevel.DEFAULT,
      HOE: toolLevel.DEFAULT,
      WATERING_CAN: toolLevel.DEFAULT,
    } as farmhand.state['toolLevels']

    const sanitizedState = transformStateDataForImport(state as any)

    expect(sanitizedState.toolLevels).toEqual({
      SCYTHE: toolLevel.DEFAULT,
      SHOVEL: toolLevel.DEFAULT,
      HOE: toolLevel.DEFAULT,
      WATERING_CAN: toolLevel.DEFAULT,
      [toolType.AXE]: toolLevel.UNAVAILABLE,
    })
  })

  test('backfills a missing AXE toolLevel to DEFAULT when the player has already passed the unlock level', () => {
    // A save this far along never gets another chance to unlock the axe
    // retroactively - processLevelUp only fires on a new level-up crossing
    // the threshold, not on load - so it should come back unlocked rather
    // than staying UNAVAILABLE forever.
    state.experience = 20000 // level 15+, past the axe's unlock level
    state.toolLevels = {
      SCYTHE: toolLevel.DEFAULT,
      SHOVEL: toolLevel.DEFAULT,
      HOE: toolLevel.DEFAULT,
      WATERING_CAN: toolLevel.DEFAULT,
    } as farmhand.state['toolLevels']

    const sanitizedState = transformStateDataForImport(state as any)

    expect(sanitizedState.toolLevels).toEqual({
      SCYTHE: toolLevel.DEFAULT,
      SHOVEL: toolLevel.DEFAULT,
      HOE: toolLevel.DEFAULT,
      WATERING_CAN: toolLevel.DEFAULT,
      [toolType.AXE]: toolLevel.DEFAULT,
    })
  })

  test('leaves an already-present AXE toolLevel untouched', () => {
    state.toolLevels = {
      AXE: toolLevel.BRONZE,
      SCYTHE: toolLevel.DEFAULT,
      SHOVEL: toolLevel.DEFAULT,
      HOE: toolLevel.DEFAULT,
      WATERING_CAN: toolLevel.DEFAULT,
    } as farmhand.state['toolLevels']

    const sanitizedState = transformStateDataForImport(state as any)

    expect(sanitizedState.toolLevels).toEqual(state.toolLevels)
  })
})
