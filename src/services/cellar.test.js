import { wineChardonnay } from '../data/recipes'
import { pumpkin } from '../data/crops'

import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine'

import { cellarService } from './cellar'

const mockUuid = 'abc123'

beforeEach(() => {
  // @ts-expect-error
  jest.spyOn(cellarService, '_uuid').mockReturnValue(mockUuid)
})

describe('CellarService', () => {
  describe('generateKeg', () => {
    test('generates a fermented crop keg', () => {
      const keg = cellarService.generateKeg(pumpkin)

      expect(keg).toEqual({
        daysUntilMature: pumpkin.daysToFerment,
        itemId: pumpkin.id,
        id: mockUuid,
      })
    })

    test('generates a wine keg', () => {
      const keg = cellarService.generateKeg(wineChardonnay)

      expect(keg).toEqual({
        daysUntilMature: getYeastRequiredForWine(wineChardonnay.variety),
        itemId: wineChardonnay.id,
        id: mockUuid,
      })
    })
  })

  describe('doesKegSpoil', () => {
    test.each([
      { keg: cellarService.generateKeg(pumpkin), expected: true },
      { keg: cellarService.generateKeg(wineChardonnay), expected: false },
    ])('$keg.itemId spoils -> $expected', ({ keg, expected }) => {
      const result = cellarService.doesKegSpoil(keg)

      expect(result).toEqual(expected)
    })
  })
})
