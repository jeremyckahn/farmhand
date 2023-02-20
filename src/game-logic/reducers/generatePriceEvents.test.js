import { PRICE_CRASH, PRICE_SURGE } from '../../templates'
import { sampleCropItem1 } from '../../data/items'
import { getPriceEventForCrop } from '../../utils'

import { generatePriceEvents } from './generatePriceEvents'

jest.mock('../../data/levels', () => ({ levels: [], itemUnlockLevels: {} }))
jest.mock('../../data/items')

describe('generatePriceEvents', () => {
  describe('price event already exists', () => {
    test('no-ops', () => {
      jest.spyOn(Math, 'random').mockReturnValue(1)
      const inputState = {
        newDayNotifications: [],
        priceCrashes: {
          [sampleCropItem1.id]: {
            itemId: sampleCropItem1.id,
            daysRemaining: 1,
          },
        },
        priceSurges: {},
      }
      const { priceCrashes, priceSurges } = generatePriceEvents(inputState)

      expect(priceCrashes).toEqual(inputState.priceCrashes)
      expect(priceSurges).toEqual(inputState.priceSurges)
    })
  })

  describe('price event does not already exist', () => {
    let state

    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0)

      jest.resetModules()
      jest.mock('../../data/levels', () => ({
        levels: [
          {
            id: 0,
          },
          {
            id: 1,
            unlocksShopItem: 'sample-crop-1-seed',
          },
        ],
        itemUnlockLevels: {},
      }))
      const { generatePriceEvents } = jest.requireActual('./')
      state = generatePriceEvents({
        newDayNotifications: [],
        priceCrashes: {},
        priceSurges: {},
        itemsSold: { 'sample-crop-1': Infinity },
      })
    })

    test('generates a price event', () => {
      const priceEvents = {
        [sampleCropItem1.id]: getPriceEventForCrop(sampleCropItem1),
      }

      expect(state).toContainAnyEntries([
        ['priceCrashes', priceEvents],
        ['priceSurges', priceEvents],
      ])
    })

    test('shows notification', () => {
      expect(state.newDayNotifications).toIncludeAnyMembers([
        {
          message: PRICE_CRASH`${sampleCropItem1}`,
          severity: 'warning',
        },
        {
          message: PRICE_SURGE`${sampleCropItem1}`,
          severity: 'success',
        },
      ])
    })
  })
})
