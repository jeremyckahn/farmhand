import { wineChardonnay } from '../data/recipes.ts'
import { pumpkin } from '../data/crops/index.ts'

import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine.ts'

import { cellarService } from './cellar.ts'

const mockUuid = 'abc123'

beforeEach(() => {
  vitest.spyOn(cellarService, '_uuid').mockReturnValue(mockUuid)
})

describe('CellarService', () => {
  describe('generateKeg', () => {
    test('generates a fermented crop keg', () => {
      const keg = cellarService.generateKeg(pumpkin)

      expect(keg).toEqual({
        // @ts-expect-error
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
