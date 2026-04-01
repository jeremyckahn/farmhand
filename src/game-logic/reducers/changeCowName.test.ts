import { MAX_ANIMAL_NAME_LENGTH } from '../../constants.ts'
import { generateCow } from '../../utils/index.tsx'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.ts'

import { changeCowName } from './changeCowName.ts'

describe('changeCowName', () => {
  test('updates cow name', () => {
    const cow = generateCow()
    const { cowInventory } = changeCowName(
      saveDataStubFactory({
        cowInventory: [generateCow(), cow],
      }),
      cow.id,
      'new name'
    )

    expect(cowInventory[1]).toEqual({
      ...cow,
      name: 'new name',
    })
  })

  test('restricts name length', () => {
    const cow = generateCow()
    const { cowInventory } = changeCowName(
      saveDataStubFactory({
        cowInventory: [cow],
      }),
      cow.id,
      new Array(100).join('.')
    )

    expect(cowInventory[0].name).toHaveLength(MAX_ANIMAL_NAME_LENGTH)
  })
})
