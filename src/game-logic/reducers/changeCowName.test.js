import { MAX_ANIMAL_NAME_LENGTH } from '../../constants.js'
import { generateCow } from '../../utils/index.js'

import { changeCowName } from './changeCowName.js'

describe('changeCowName', () => {
  test('updates cow name', () => {
    const cow = generateCow()
    const { cowInventory } = changeCowName(
      {
        cowInventory: [generateCow(), cow],
      },
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
      {
        cowInventory: [cow],
      },
      cow.id,
      new Array(100).join('.')
    )

    expect(cowInventory[0].name).toHaveLength(MAX_ANIMAL_NAME_LENGTH)
  })
})
