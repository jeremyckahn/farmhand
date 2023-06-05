import { randomNumberService } from '../../common/services/randomNumber'
import { KEG_SPOILED_MESSAGE } from '../../templates'
import { getKegStub } from '../../test-utils/stubs/getKegStub'

import { processCellarSpoilage } from './processCellarSpoilage'

describe('processCellarSpoilage', () => {
  test('does not remove kegs that have not spoiled', () => {
    jest
      .spyOn(randomNumberService, 'isRandomNumberLessThan')
      .mockReturnValueOnce(false)

    const keg = getKegStub()
    const cellarInventory = [keg]
    const newDayNotifications = []
    const expectedState = processCellarSpoilage({
      cellarInventory,
      newDayNotifications,
    })

    expect(expectedState.cellarInventory).toHaveLength(1)
  })

  test('removes kegs that have spoiled', () => {
    jest
      .spyOn(randomNumberService, 'isRandomNumberLessThan')
      .mockReturnValueOnce(true)

    const keg = getKegStub()
    const cellarInventory = [keg]
    const newDayNotifications = []
    const expectedState = processCellarSpoilage({
      cellarInventory,
      newDayNotifications,
    })

    expect(expectedState.cellarInventory).toHaveLength(0)
  })

  test('shows notification for kegs that have spoiled', () => {
    jest
      .spyOn(randomNumberService, 'isRandomNumberLessThan')
      .mockReturnValueOnce(true)

    const keg = getKegStub()
    const cellarInventory = [keg]
    const newDayNotifications = []
    const expectedState = processCellarSpoilage({
      cellarInventory,
      newDayNotifications,
    })

    expect(expectedState.newDayNotifications).toEqual([
      {
        message: KEG_SPOILED_MESSAGE`${keg}`,
        severity: 'error',
      },
    ])
  })
})
