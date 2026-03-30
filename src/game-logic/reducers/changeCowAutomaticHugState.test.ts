import { huggingMachine } from '../../data/items.ts'
import { generateCow } from '../../utils/index.tsx'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.ts'

import { INFINITE_STORAGE_LIMIT } from '../../constants.ts'

import { changeCowAutomaticHugState } from './changeCowAutomaticHugState.ts'

describe('changeCowAutomaticHugState', () => {
  describe('setting isUsingHuggingMachine to true', () => {
    test('sets isUsingHuggingMachine to true', () => {
      const cow = generateCow()
      const inputState = saveDataStubFactory({
        cowInventory: [cow],
        inventory: [{ id: huggingMachine.id, quantity: 1 }],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
      })
      const {
        cowInventory: [{ isUsingHuggingMachine }],
        inventory,
      } = changeCowAutomaticHugState(inputState, cow, true)

      expect(isUsingHuggingMachine).toEqual(true)
      expect(inventory).toEqual([])
    })

    describe('there are no hugging machines in inventory', () => {
      test('no-ops', () => {
        const cow = generateCow()
        const inputState = saveDataStubFactory({
          cowInventory: [cow],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        })
        const state = changeCowAutomaticHugState(inputState, cow, true)

        expect(state).toBe(inputState)
      })
    })

    describe('isUsingHuggingMachine is already true', () => {
      test('no-ops', () => {
        const cow = generateCow({ isUsingHuggingMachine: true })
        const inputState = saveDataStubFactory({
          cowInventory: [cow],
          inventory: [{ id: huggingMachine.id, quantity: 1 }],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        })
        const state = changeCowAutomaticHugState(inputState, cow, true)

        expect(state).toBe(inputState)
      })
    })
  })

  describe('setting isUsingHuggingMachine to false', () => {
    test('sets isUsingHuggingMachine to false', () => {
      const cow = generateCow({ isUsingHuggingMachine: true })
      const inputState = saveDataStubFactory({
        cowInventory: [cow],
        inventory: [],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
      })
      const {
        cowInventory: [{ isUsingHuggingMachine }],
        inventory,
      } = changeCowAutomaticHugState(inputState, cow, false)

      expect(isUsingHuggingMachine).toEqual(false)
      expect(inventory).toEqual([{ id: huggingMachine.id, quantity: 1 }])
    })
  })
})
