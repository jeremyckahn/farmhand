import {
    silverOre
} from '../data/items.js'
import {
    cropLifeStage
} from '../enums.js'
import { items as itemImages } from '../img/index.js'
import {
    getPlotContentFromItemId,
    getPlotImage
} from './index.js'
import { testCrop } from "../test-utils/testCrop.js";

const { SEED, GROWING, GROWN } = cropLifeStage

const percentageStringTests = [
  [0, '0%'],
  [0.5, '50%'],
  [1, '100%'],
  [1.5, '150%'],
  [2, '200%'],
]

const dollarStringTests = [
  [0, '$0.00'],
  [0.5, '$0.50'],
  [1, '$1.00'],
  [1.5, '$1.50'],
  [2, '$2.00'],
]

const integerStringTests = [
  [0, '0'],
  [0.5, '1'],
  [1, '1'],
  [1.5, '2'],
  [2, '2'],
]


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
    ).toBe(itemImages[silverOre.id])
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
