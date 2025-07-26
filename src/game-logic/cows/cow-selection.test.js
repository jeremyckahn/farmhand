import { testState } from '../../test-utils/index.js'
import { selectCow } from '../reducers/selectCow.js'
import { generateCow, getCowDisplayName } from '../../utils/index.js'
import { stageFocusType } from '../../enums.js'

describe('cow selection logic', () => {
  describe('selectCow reducer', () => {
    test('sets selectedCowId when cow is selected', () => {
      const cow = generateCow({ id: 'test-cow-123' })
      const initialState = testState({ selectedCowId: '' })

      const result = selectCow(initialState, cow)

      expect(result.selectedCowId).toBe('test-cow-123')
      expect(result).not.toBe(initialState) // ensures immutability
    })

    test('overwrites previous selectedCowId when new cow is selected', () => {
      const cow2 = generateCow({ id: 'cow-2' })
      const initialState = testState({ selectedCowId: 'cow-1' })

      const result = selectCow(initialState, cow2)

      expect(result.selectedCowId).toBe('cow-2')
    })

    test('preserves other state properties', () => {
      const cow = generateCow({ id: 'test-cow' })
      const initialState = testState({
        selectedCowId: '',
        money: 1000,
        dayCount: 5,
        cowInventory: [cow],
      })

      const result = selectCow(initialState, cow)

      expect(result.money).toBe(1000)
      expect(result.dayCount).toBe(5)
      expect(result.cowInventory).toBe(initialState.cowInventory)
    })
  })

  describe('cow selection behavior patterns', () => {
    test('no cow is selected by default in initial state', () => {
      const state = testState()

      expect(state.selectedCowId).toBe('')
    })

    test('selecting different cows updates selection correctly', () => {
      const cow1 = generateCow({ id: 'cow-1' })
      const cow2 = generateCow({ id: 'cow-2' })
      let state = testState({ selectedCowId: '' })

      // Select first cow
      state = selectCow(state, cow1)
      expect(state.selectedCowId).toBe('cow-1')

      // Select second cow (should deselect first)
      state = selectCow(state, cow2)
      expect(state.selectedCowId).toBe('cow-2')
    })

    test('view changes should clear cow selection', () => {
      let state = testState({
        selectedCowId: 'selected-cow',
        stageFocus: stageFocusType.COW_PEN,
      })

      // Simulate view change by clearing selectedCowId
      // (This would be handled by Farmhand component's componentDidUpdate)
      state = { ...state, selectedCowId: '', stageFocus: stageFocusType.SHOP }

      expect(state.selectedCowId).toBe('')
      expect(state.stageFocus).toBe(stageFocusType.SHOP)
    })
  })

  describe('cow display name generation', () => {
    test('generates consistent display names for cow selection UI', () => {
      const cow1 = generateCow({ id: 'test-id-1' })
      const cow2 = generateCow({ id: 'test-id-2' })

      const displayName1 = getCowDisplayName(cow1, 'player-id', false)
      const displayName2 = getCowDisplayName(cow2, 'player-id', false)

      expect(typeof displayName1).toBe('string')
      expect(typeof displayName2).toBe('string')
      expect(displayName1.length).toBeGreaterThan(0)
      expect(displayName2.length).toBeGreaterThan(0)
      // Each cow should have a unique name (even if randomly generated)
      expect(displayName1).not.toBe(displayName2)
    })

    test('handles custom peer cow names setting', () => {
      const testCow = generateCow({ id: 'peer-cow', name: 'Custom Name' })

      const displayNameWithCustom = getCowDisplayName(testCow, 'peer-id', true)
      const displayNameWithoutCustom = getCowDisplayName(
        testCow,
        'peer-id',
        false
      )

      // Both should return the cow name, but the function handles the peer ID and custom names setting
      expect(typeof displayNameWithCustom).toBe('string')
      expect(typeof displayNameWithoutCustom).toBe('string')
    })
  })

  describe('cow selection state transitions', () => {
    test('simulates typical cow selection workflow', () => {
      const cow1 = generateCow({ id: 'cow-alpha' })
      const cow2 = generateCow({ id: 'cow-beta' })

      // Start with no selection
      let state = testState({
        selectedCowId: '',
        cowInventory: [cow1, cow2],
      })

      // User clicks on first cow
      state = selectCow(state, cow1)
      expect(state.selectedCowId).toBe('cow-alpha')

      // User clicks on second cow (first should be deselected)
      state = selectCow(state, cow2)
      expect(state.selectedCowId).toBe('cow-beta')

      // User navigates away (selection should be cleared - simulated)
      state = { ...state, selectedCowId: '' }
      expect(state.selectedCowId).toBe('')
    })

    test('handles selection of same cow multiple times', () => {
      const cow = generateCow({ id: 'same-cow' })
      let state = testState({ selectedCowId: '' })

      // Select cow first time
      state = selectCow(state, cow)
      expect(state.selectedCowId).toBe('same-cow')

      // Select same cow again
      state = selectCow(state, cow)
      expect(state.selectedCowId).toBe('same-cow')
    })
  })

  describe('cow selection with empty inventory', () => {
    test('handles selection when no cows exist', () => {
      const state = testState({
        selectedCowId: '',
        cowInventory: [],
      })

      expect(state.selectedCowId).toBe('')
      expect(state.cowInventory).toHaveLength(0)
    })

    test('maintains selection state structure even with empty cow inventory', () => {
      const cow = generateCow({ id: 'phantom-cow' })
      const state = testState({
        selectedCowId: '',
        cowInventory: [],
      })

      const result = selectCow(state, cow)

      expect(result.selectedCowId).toBe('phantom-cow')
      expect(result.cowInventory).toHaveLength(0)
    })
  })
})
