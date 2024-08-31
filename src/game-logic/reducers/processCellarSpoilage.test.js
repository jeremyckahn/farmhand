import { randomNumberService } from '../../common/services/randomNumber.js'
import { wineTempranillo } from '../../data/recipes.js'
import { KEG_SPOILED_MESSAGE } from '../../templates.js'
import { getKegStub } from '../../test-utils/stubs/getKegStub.js'

import { processCellarSpoilage } from './processCellarSpoilage.js'

describe('processCellarSpoilage', () => {
  test('does not remove kegs that have not spoiled', () => {
    vitest
      .spyOn(randomNumberService, 'isRandomNumberLessThan')
      .mockReturnValueOnce(false)

    const keg = getKegStub()
    const cellarInventory = [keg]
    const newDayNotifications = []

    // @ts-expect-error
    const expectedState = processCellarSpoilage({
      cellarInventory,
      newDayNotifications,
    })

    expect(expectedState.cellarInventory).toHaveLength(1)
  })

  test('removes kegs that have spoiled', () => {
    vitest
      .spyOn(randomNumberService, 'isRandomNumberLessThan')
      .mockReturnValueOnce(true)

    const keg = getKegStub()
    const cellarInventory = [keg]
    const newDayNotifications = []

    // @ts-expect-error
    const expectedState = processCellarSpoilage({
      cellarInventory,
      newDayNotifications,
    })

    expect(expectedState.cellarInventory).toHaveLength(0)
  })

  test('does not remove wine keg', () => {
    vitest
      .spyOn(randomNumberService, 'isRandomNumberLessThan')
      .mockReturnValueOnce(true)

    const keg = getKegStub({ itemId: wineTempranillo.id })
    const cellarInventory = [keg]
    const newDayNotifications = []

    // @ts-expect-error
    const expectedState = processCellarSpoilage({
      cellarInventory,
      newDayNotifications,
    })

    expect(expectedState.cellarInventory).toHaveLength(1)
  })

  test('shows notification for kegs that have spoiled', () => {
    vitest
      .spyOn(randomNumberService, 'isRandomNumberLessThan')
      .mockReturnValueOnce(true)

    const keg = getKegStub()
    const cellarInventory = [keg]
    const newDayNotifications = []

    // @ts-expect-error
    const expectedState = processCellarSpoilage({
      cellarInventory,
      newDayNotifications,
    })

    expect(expectedState.newDayNotifications).toEqual([
      {
        // @ts-expect-error
        message: KEG_SPOILED_MESSAGE`${keg}`,
        severity: 'error',
      },
    ])
  })
})
