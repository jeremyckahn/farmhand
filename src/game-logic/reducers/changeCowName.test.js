import { MAX_ANIMAL_NAME_LENGTH } from '../../constants'
import { generateCow } from '../../utils'

import { changeCowName } from './changeCowName'

describe('changeCowName', () => {
  test('updates cow name', () => {
    const cow = generateCow()
    const { cowInventory } = changeCowName(
      {
        cowInventory: [generateCow(), cow],
      },
      cow.playerId,
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
      cow.playerId,
      new Array(100).join('.')
    )

    expect(cowInventory[0].name).toHaveLength(MAX_ANIMAL_NAME_LENGTH)
  })
})
