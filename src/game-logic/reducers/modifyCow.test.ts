import { getCowStub } from '../../test-utils/stubs/cowStub.js'
import { testState } from '../../test-utils/index.js'

import { modifyCow } from './modifyCow.js'

describe('modifyCow', () => {
  test('updates the matching cow', () => {
    const cow1 = getCowStub({ id: 'cow-1', name: 'Bessie' })
    const cow2 = getCowStub({ id: 'cow-2', name: 'Daisy' })
    const state = testState({ cowInventory: [cow1, cow2] })

    const { cowInventory } = modifyCow(state, 'cow-2', () => ({
      name: 'Clover',
    }))

    expect(cowInventory).toEqual([cow1, { ...cow2, name: 'Clover' }])
  })

  test('does not mutate the original cowInventory', () => {
    const cow = getCowStub({ id: 'cow-1' })
    const state = testState({ cowInventory: [cow] })

    modifyCow(state, 'cow-1', () => ({ name: 'Clover' }))

    expect(state.cowInventory).toEqual([cow])
  })

  test('no-ops if the cow does not exist', () => {
    const state = testState({ cowInventory: [getCowStub({ id: 'cow-1' })] })

    expect(modifyCow(state, 'missing', () => ({ name: 'x' }))).toBe(state)
  })
})
