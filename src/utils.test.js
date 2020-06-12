import {
  canMakeRecipe,
  dollarString,
  generateCow,
  generateValueAdjustments,
  getCowMilkRate,
  getCowValue,
  getCowWeight,
  getCropId,
  getCropLifeStage,
  getCropLifecycleDuration,
  getFinalCropItemIdFromSeedItemId,
  getItemValue,
  getLifeStageRange,
  getPlotContentFromItemId,
  getPlotImage,
  getPriceEventForCrop,
  getRandomCropItem,
  getRangeCoords,
  isItemAFarmProduct,
  moneyString,
  sumMoneyNumbers,
} from './utils'
import fruitNames from './data/fruit-names'
import { testCrop } from './test-utils'
import { items as itemImages } from './img'
import { cowColors, cropLifeStage, genders } from './enums'
import {
  sampleCropItem1,
  sampleCropSeedsItem1,
  sampleItem1,
  sampleFieldTool1,
  milk1,
} from './data/items'
import {
  COW_MAXIMUM_AGE_VALUE_DROPOFF,
  COW_MAXIMUM_VALUE_MULTIPLIER,
  COW_MILK_RATE_FASTEST,
  COW_MILK_RATE_SLOWEST,
  COW_MINIMUM_VALUE_MULTIPLIER,
  COW_STARTING_WEIGHT_BASE,
  COW_STARTING_WEIGHT_VARIANCE,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  MALE_COW_WEIGHT_MULTIPLIER,
} from './constants'

jest.mock('./data/maps')
jest.mock('./data/items')
jest.mock('./img')

const { SEED, GROWING, GROWN } = cropLifeStage

describe('sumMoneyNumbers', () => {
  test('adds numbers', () => {
    expect(sumMoneyNumbers(0.1, 0.2)).toEqual(0.3)
  })

  test('subtracts numbers', () => {
    expect(sumMoneyNumbers(1000, -999.99)).toEqual(0.01)
  })
})

describe('moneyString', () => {
  test('formats number to dollar string', () => {
    expect(moneyString(1234.567)).toEqual('$1,234.57')
  })
})

describe('dollarString', () => {
  test('formats number to dollar string', () => {
    expect(dollarString(1234.567)).toEqual('$1,235')
  })
})

describe('isItemAFarmProduct', () => {
  describe('item is a seed', () => {
    test('returns correct result', () => {
      expect(isItemAFarmProduct(sampleCropSeedsItem1)).toBe(false)
    })
  })

  describe('item is grown crop', () => {
    test('returns correct result', () => {
      expect(isItemAFarmProduct(sampleCropItem1)).toBe(true)
    })
  })

  describe('item is milk', () => {
    test('returns correct result', () => {
      expect(isItemAFarmProduct(milk1)).toBe(true)
    })
  })
})

describe('getItemValue', () => {
  let valueAdjustments

  beforeEach(() => {
    valueAdjustments = {
      'sample-item-1': 1.5,
      'sample-field-tool-1': 1.5,
    }
  })

  describe('stable value item', () => {
    test('computes value', () => {
      expect(getItemValue({ id: 'sample-item-1' }, valueAdjustments)).toEqual(
        sampleItem1.value * 1.5
      )
    })
  })

  describe('fluctuating value item', () => {
    test('computes value', () => {
      expect(
        getItemValue({ id: 'sample-field-tool-1' }, valueAdjustments)
      ).toEqual(sampleFieldTool1.value)
    })
  })
})

describe('generateValueAdjustments', () => {
  let valueAdjustments

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(1)
    valueAdjustments = generateValueAdjustments({}, {})
  })

  describe('item has a fluctuating price', () => {
    test('updates valueAdjustments by random factor', () => {
      expect(valueAdjustments['sample-crop-1']).toEqual(1.5)
      expect(valueAdjustments['sample-crop-2']).toEqual(1.5)
    })
  })

  describe('item does not have a fluctuating price', () => {
    test('valueAdjustments value is not defined', () => {
      expect(valueAdjustments['sample-field-tool-1']).toEqual(undefined)
    })
  })

  describe('factors in price crashes', () => {
    valueAdjustments = generateValueAdjustments(
      { 'sample-crop-1': { itemId: 'sample-crop-1', daysRemaining: 1 } },
      {}
    )

    expect(valueAdjustments['sample-crop-1']).toEqual(0.5)
  })

  describe('factors in price surges', () => {
    valueAdjustments = generateValueAdjustments(
      {},
      { 'sample-crop-1': { itemId: 'sample-crop-1', daysRemaining: 1 } }
    )

    expect(valueAdjustments['sample-crop-1']).toEqual(1.5)
  })
})

describe('generateCow', () => {
  describe('randomizer: lower bound', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0)
    })

    const baseCowProperties = {
      color: Object.keys(cowColors)[0],
      daysOld: 1,
      name: fruitNames[0],
    }

    describe('female cows', () => {
      test('generates a cow', () => {
        const baseWeight = Math.round(
          COW_STARTING_WEIGHT_BASE - COW_STARTING_WEIGHT_VARIANCE
        )

        expect(generateCow({ gender: genders.FEMALE })).toMatchObject({
          ...baseCowProperties,
          gender: genders.FEMALE,
          baseWeight,
        })
      })
    })

    describe('male cows', () => {
      test('generates a cow', () => {
        const baseWeight = Math.round(
          COW_STARTING_WEIGHT_BASE * MALE_COW_WEIGHT_MULTIPLIER -
            COW_STARTING_WEIGHT_VARIANCE
        )

        expect(generateCow({ gender: genders.MALE })).toMatchObject({
          ...baseCowProperties,
          gender: genders.MALE,
          baseWeight,
        })
      })
    })
  })

  describe('randomizer: upper bound', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(1)
    })

    test('generates a cow', () => {
      const baseWeight = COW_STARTING_WEIGHT_BASE + COW_STARTING_WEIGHT_VARIANCE

      expect(generateCow()).toMatchObject({
        color: Object.keys(cowColors).pop(),
        daysOld: 1,
        gender: Object.keys(genders).pop(),
        name: fruitNames[fruitNames.length - 1],
        baseWeight,
      })
    })
  })
})

describe('getCowMilkRate', () => {
  describe('non-female cows', () => {
    test('computes correct milk rate', () => {
      expect(
        getCowMilkRate(
          generateCow({
            gender: genders.MALE,
          })
        )
      ).toEqual(Infinity)
    })
  })

  describe('female cows', () => {
    const baseCow = generateCow({ gender: genders.FEMALE })

    describe('minimal weightMultiplier', () => {
      test('computes correct milk rate', () => {
        expect(
          getCowMilkRate({
            ...baseCow,
            weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
          })
        ).toEqual(COW_MILK_RATE_SLOWEST)
      })
    })

    describe('median weightMultiplier', () => {
      test('computes correct milk rate', () => {
        expect(getCowMilkRate({ ...baseCow, weightMultiplier: 1 })).toEqual(
          (COW_MILK_RATE_SLOWEST + COW_MILK_RATE_FASTEST) / 2
        )
      })
    })

    describe('maximum weightMultiplier', () => {
      test('computes correct milk rate', () => {
        expect(
          getCowMilkRate({
            ...baseCow,
            weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM,
          })
        ).toEqual(COW_MILK_RATE_FASTEST)
      })
    })
  })
})

describe('getCowValue', () => {
  const baseWeight = 100

  describe('young cow (best value)', () => {
    test('computes cow value', () => {
      expect(getCowValue(generateCow({ baseWeight, daysOld: 1 }))).toEqual(
        baseWeight * COW_MAXIMUM_VALUE_MULTIPLIER
      )
    })
  })

  describe('old cow (worst value)', () => {
    test('computes cow value', () => {
      expect(
        getCowValue(
          generateCow({ baseWeight, daysOld: COW_MAXIMUM_AGE_VALUE_DROPOFF })
        )
      ).toEqual(baseWeight * COW_MINIMUM_VALUE_MULTIPLIER)
    })
  })

  describe('very old cow (worst value)', () => {
    test('computes cow value', () => {
      expect(
        getCowValue(generateCow({ baseWeight, daysOld: Number.MAX_VALUE }))
      ).toEqual(baseWeight * COW_MINIMUM_VALUE_MULTIPLIER)
    })
  })
})

describe('getCowWeight', () => {
  test('computes cow value', () => {
    expect(
      getCowWeight(generateCow({ baseWeight: 100, weightMultiplier: 2 }))
    ).toEqual(200)
  })
})

describe('getCropId', () => {
  test('returns an ID for a provided crop', () => {
    expect(getCropId({ itemId: 'sample-crop-1' })).toBe('sample-crop-type-1')
  })
})

describe('getLifeStageRange', () => {
  test('converts a cropTimetable to an array of stages', () => {
    expect(getLifeStageRange({ [SEED]: 1, [GROWING]: 2 })).toEqual([
      SEED,
      GROWING,
      GROWING,
    ])
  })
})

describe('getCropLifecycleDuration', () => {
  test('computes lifecycle duration', () => {
    expect(getCropLifecycleDuration(sampleCropItem1)).toEqual(3)
  })
})

describe('getCropLifeStage', () => {
  test('maps a life cycle label to an image name chunk', () => {
    const itemId = 'sample-crop-1'

    expect(getCropLifeStage({ itemId, daysWatered: 0 })).toBe(SEED)
    expect(getCropLifeStage({ itemId, daysWatered: 1.5 })).toBe(GROWING)
    expect(getCropLifeStage({ itemId, daysWatered: 3 })).toBe(GROWN)
  })
})

describe('getPlotImage', () => {
  test('returns null when no plotContent is provided', () => {
    expect(getPlotImage(null)).toBe(null)
  })

  test('returns a plot images for a crop', () => {
    const itemId = 'sample-crop-1'

    expect(getPlotImage(testCrop({ itemId, daysWatered: 0 }))).toBe(
      itemImages['sample-crop-type-1-seed']
    )
    expect(getPlotImage(testCrop({ itemId, daysWatered: 1 }))).toBe(
      itemImages['sample-crop-type-1-growing']
    )
    expect(getPlotImage(testCrop({ itemId, daysWatered: 3 }))).toBe(
      itemImages['sample-crop-type-1']
    )
  })

  test('returns item image for non-crop content', () => {
    expect(getPlotImage(getPlotContentFromItemId('sprinkler'))).toBe(
      itemImages['sprinkler']
    )
  })
})

describe('getRangeCoords', () => {
  describe('surrounded by plots', () => {
    test('computes the plot range', () => {
      expect(getRangeCoords(1, 1, 1)).toEqual([
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
        ],
        [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ],
        [
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
        ],
      ])
    })
  })

  describe('edge testing', () => {
    test('in-range plots below field bounds are negative', () => {
      expect(getRangeCoords(1, 0, 0)).toEqual([
        [
          { x: -1, y: -1 },
          { x: 0, y: -1 },
          { x: 1, y: -1 },
        ],
        [
          { x: -1, y: 0 },
          { x: 0, y: 0 },
          { x: 1, y: 0 },
        ],
        [
          { x: -1, y: 1 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
        ],
      ])
    })
  })
})

describe('getFinalCropItemIdFromSeedItemId', () => {
  test('gets "final" crop item id from seed item id', () => {
    expect(getFinalCropItemIdFromSeedItemId('sample-crop-seeds-1')).toEqual(
      'sample-crop-1'
    )
  })
})

describe('canMakeRecipe', () => {
  describe('player does not have sufficient ingredients', () => {
    test('evaluates inventory correctly', () => {
      expect(
        canMakeRecipe({ ingredients: { 'sample-item-1': 2 } }, [
          { id: 'sample-item-1', quantity: 1 },
        ])
      ).toBe(false)
    })
  })

  describe('player does have sufficient ingredients', () => {
    test('evaluates inventory correctly', () => {
      expect(
        canMakeRecipe({ ingredients: { 'sample-item-1': 2 } }, [
          { id: 'sample-item-1', quantity: 2 },
        ])
      ).toBe(true)
    })
  })
})

describe('getPriceEventForCrop', () => {
  test('returns price event', () => {
    expect(getPriceEventForCrop(sampleCropItem1)).toEqual({
      itemId: sampleCropItem1.id,
      daysRemaining: 2,
    })
  })
})

describe('getRandomCropItem', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0)
  })

  test('returns a crop item', () => {
    expect(getRandomCropItem()).toEqual(sampleCropItem1)
  })
})
