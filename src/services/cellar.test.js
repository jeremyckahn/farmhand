import { wineChardonnay } from '../data/recipes'
import { pumpkin } from '../data/crops'

import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine'

import { CellarService } from './cellar'

const mockUuid = 'abc123'

const mockUuidFactory = () => {
  return mockUuid
}

// @ts-expect-error
const stubCellarService = new CellarService(mockUuidFactory)

describe('CellarService', () => {
  describe('generateKeg', () => {
    test('generates a fermented crop keg', () => {
      const keg = stubCellarService.generateKeg(pumpkin)

      expect(keg).toEqual({
        daysUntilMature: pumpkin.daysToFerment,
        itemId: pumpkin.id,
        id: mockUuid,
      })
    })

    test('generates a wine keg', () => {
      const keg = stubCellarService.generateKeg(wineChardonnay)

      expect(keg).toEqual({
        daysUntilMature: getYeastRequiredForWine(wineChardonnay.variety),
        itemId: wineChardonnay.id,
        id: mockUuid,
      })
    })
  })
})
