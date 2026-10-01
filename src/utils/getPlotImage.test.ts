import { testCrop } from '../test-utils/index.js'
import { items as itemImages } from '../img/index.js'
import { silverOre } from '../data/items.js'
import { fertilizerType } from '../enums.js'

import { getPlotImage } from './getPlotImage.js'
import { getPlotContentFromItemId } from './getPlotContentFromItemId.js'

describe('getPlotImage', () => {
  test('returns null when no plotContent is provided', () => {
    expect(getPlotImage((null as unknown) as farmhand.plotContent, 0, 0)).toBe(
      null
    )
  })

  test('returns plot images for a crop', () => {
    const itemId = 'carrot'

    expect(
      getPlotImage(
        (testCrop({
          itemId,
          daysWatered: 0,
        }) as unknown) as farmhand.plotContent,
        0,
        0
      )
    ).toBe(itemImages['carrot-seed'])
    expect(
      getPlotImage(
        (testCrop({
          itemId,
          daysWatered: 1,
        }) as unknown) as farmhand.plotContent,
        0,
        0
      )
    ).toBe(itemImages['carrot-seed'])
    expect(
      getPlotImage(
        (testCrop({
          itemId,
          daysWatered: 3,
        }) as unknown) as farmhand.plotContent,
        0,
        0
      )
    ).toBe(itemImages['carrot-growing-2'])
    expect(
      getPlotImage(
        (testCrop({
          itemId,
          daysWatered: 5,
        }) as unknown) as farmhand.plotContent,
        0,
        0
      )
    ).toBe(itemImages['carrot'])
  })

  test('returns item image for oreId', () => {
    expect(
      getPlotImage(
        (getPlotContentFromItemId(
          silverOre.id
        ) as unknown) as farmhand.plotContent,
        0,
        0
      )
    ).toBe((itemImages as Record<string, string>)[silverOre.id])
  })

  test('returns ore image for a freshly-shoveled plot', () => {
    // Mirrors the shape minePlot() produces: itemId is an empty string
    // while the plot is shoveled, so isPlotContent() must not mistake it
    // for real plot content based on itemId's mere presence.
    const shoveledPlot = {
      itemId: '',
      fertilizerType: fertilizerType.NONE,
      isShoveled: true,
      daysUntilClear: 3,
      oreId: silverOre.id,
    }

    expect(
      getPlotImage((shoveledPlot as unknown) as farmhand.shoveledPlot, 0, 0)
    ).toBe((itemImages as Record<string, string>)[silverOre.id])
  })

  test('returns item image for other content', () => {
    expect(
      getPlotImage(
        (getPlotContentFromItemId(
          'sprinkler'
        ) as unknown) as farmhand.plotContent,
        0,
        0
      )
    ).toBe(itemImages['sprinkler'])
  })
})
