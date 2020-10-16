import {
  canMakeRecipe,
  castToMoney,
  chooseRandom,
  dollarString,
  farmProductSalesVolumeNeededForLevel,
  farmProductsSold,
  generateCow,
  generateOffspringCow,
  generateValueAdjustments,
  get7DayRevenueAverage,
  getCowMilkRate,
  getCowValue,
  getCowWeight,
  getCropId,
  getCropLifeStage,
  getCropLifecycleDuration,
  getFinalCropItemIdFromSeedItemId,
  getItemCurrentValue,
  getLifeStageRange,
  getPlotContentFromItemId,
  getPlotImage,
  getPriceEventForCrop,
  getRangeCoords,
  integerString,
  isItemAFarmProduct,
  levelAchieved,
  moneyString,
  moneyTotal,
} from './utils'
import fruitNames from './data/fruit-names'
import { testCrop } from './test-utils'
import { items as itemImages } from './img'
import { cowColors, cropLifeStage, genders, standardCowColors } from './enums'
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
jest.mock('./data/levels', () => ({ levels: [] }))
jest.mock('./data/shop-inventory')
jest.mock('./img')

const { SEED, GROWING, GROWN } = cropLifeStage

describe('moneyTotal', () => {
  test('adds numbers', () => {
    expect(moneyTotal(0.1, 0.2)).toEqual(0.3)
  })

  test('subtracts numbers', () => {
    expect(moneyTotal(1000, -999.99)).toEqual(0.01)
  })
})

describe('castToMoney', () => {
  test('does not change valid money value', () => {
    expect(castToMoney(1.23)).toEqual(1.23)
  })

  test('rounds up', () => {
    expect(castToMoney(1.235)).toEqual(1.24)
  })

  test('rounds down', () => {
    expect(castToMoney(1.234)).toEqual(1.23)
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

describe('integerString', () => {
  test('formats number to integer string string', () => {
    expect(integerString(1234.567)).toEqual('1,235')
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

describe('getItemCurrentValue', () => {
  let valueAdjustments

  beforeEach(() => {
    valueAdjustments = {
      'sample-item-1': 1.5,
      'sample-field-tool-1': 1.5,
    }
  })

  describe('stable value item', () => {
    test('computes value', () => {
      expect(
        getItemCurrentValue({ id: 'sample-item-1' }, valueAdjustments)
      ).toEqual(sampleItem1.value * 1.5)
    })
  })

  describe('fluctuating value item', () => {
    test('computes value', () => {
      expect(
        getItemCurrentValue({ id: 'sample-field-tool-1' }, valueAdjustments)
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
      color: Object.keys(standardCowColors)[0],
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
        color: Object.keys(standardCowColors).pop(),
        daysOld: 1,
        gender: Object.keys(genders).pop(),
        name: fruitNames[fruitNames.length - 1],
        baseWeight,
      })
    })
  })
})

describe('generateOffspringCow', () => {
  let maleCow, femaleCow

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(1)

    maleCow = generateCow({
      baseWeight: 2200,
      color: standardCowColors.ORANGE,
      colorsInBloodline: {
        [standardCowColors.ORANGE]: true,
        [standardCowColors.YELLOW]: true,
      },
      gender: genders.MALE,
    })

    femaleCow = generateCow({
      baseWeight: 2000,
      color: standardCowColors.GREEN,
      colorsInBloodline: {
        [standardCowColors.GREEN]: true,
        [standardCowColors.WHITE]: true,
      },
      gender: genders.FEMALE,
    })
  })

  test('generates offspring', () => {
    expect(generateOffspringCow(maleCow, femaleCow)).toMatchObject({
      color: chooseRandom([femaleCow.color, maleCow.color]),
      colorsInBloodline: {
        [standardCowColors.GREEN]: true,
        [standardCowColors.ORANGE]: true,
        [standardCowColors.WHITE]: true,
        [standardCowColors.YELLOW]: true,
      },
      baseWeight: 2100,
    })
  })

  test('order of parents does not matter', () => {
    const { id: id1, ...offspring1 } = generateOffspringCow(maleCow, femaleCow)
    const { id: id2, ...offspring2 } = generateOffspringCow(femaleCow, maleCow)

    expect(offspring1).toEqual(offspring2)
  })

  test('two cows of the same gender throw an error', () => {
    expect(() => generateOffspringCow(femaleCow, femaleCow)).toThrow()
  })

  describe('rainbow cows', () => {
    test('cows with all of the colors in their bloodline are rainbow cows', () => {
      jest.spyOn(Math, 'random').mockReturnValue(1)

      maleCow = generateCow({
        baseWeight: 2200,
        color: standardCowColors.ORANGE,
        colorsInBloodline: {
          [standardCowColors.BLUE]: true,
          [standardCowColors.BROWN]: true,
          [standardCowColors.GREEN]: true,
          [standardCowColors.ORANGE]: true,
          [standardCowColors.PURPLE]: true,
          [standardCowColors.WHITE]: true,
        },
        gender: genders.MALE,
      })

      femaleCow = generateCow({
        baseWeight: 2000,
        color: standardCowColors.GREEN,
        colorsInBloodline: {
          [standardCowColors.YELLOW]: true,
        },
        gender: genders.FEMALE,
      })

      expect(generateOffspringCow(maleCow, femaleCow)).toMatchObject({
        color: cowColors.RAINBOW,
        colorsInBloodline: {
          [standardCowColors.BLUE]: true,
          [standardCowColors.BROWN]: true,
          [standardCowColors.GREEN]: true,
          [standardCowColors.ORANGE]: true,
          [standardCowColors.PURPLE]: true,
          [standardCowColors.WHITE]: true,
          [standardCowColors.YELLOW]: true,
        },
        baseWeight: 2100,
      })
    })

    test('rainbow color is not stored in bloodline', () => {
      jest.spyOn(Math, 'random').mockReturnValue(1)

      maleCow = generateCow({
        baseWeight: 2200,
        color: cowColors.RAINBOW,
        colorsInBloodline: {
          [standardCowColors.BLUE]: true,
          [standardCowColors.BROWN]: true,
          [standardCowColors.GREEN]: true,
          [standardCowColors.ORANGE]: true,
          [standardCowColors.PURPLE]: true,
          [standardCowColors.WHITE]: true,
          [standardCowColors.YELLOW]: true,
        },
        gender: genders.FEMALE,
      })

      femaleCow = generateCow({
        baseWeight: 2000,
        color: standardCowColors.WHITE,
        colorsInBloodline: {
          [standardCowColors.WHITE]: true,
        },
        gender: genders.MALE,
      })

      const { colorsInBloodline } = generateOffspringCow(maleCow, femaleCow)

      expect(colorsInBloodline).toEqual({
        [standardCowColors.BLUE]: true,
        [standardCowColors.BROWN]: true,
        [standardCowColors.GREEN]: true,
        [standardCowColors.ORANGE]: true,
        [standardCowColors.PURPLE]: true,
        [standardCowColors.WHITE]: true,
        [standardCowColors.YELLOW]: true,
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

describe('farmProductsSold', () => {
  test('sums products sold', () => {
    expect(
      farmProductsSold({
        [sampleCropItem1.id]: 3,
        [sampleCropSeedsItem1.id]: 2,
      })
    ).toEqual(3)
  })
})

describe('levelAchieved', () => {
  test('calculates achieved level', () => {
    expect(levelAchieved(0)).toEqual(1)
    expect(levelAchieved(100)).toEqual(2)
    expect(levelAchieved(150)).toEqual(2)
    expect(levelAchieved(400)).toEqual(3)
    expect(levelAchieved(980100)).toEqual(100)
  })
})

describe('farmProductSalesVolumeNeededForLevel', () => {
  test('calculates farm sales volume that will meet level requirements', () => {
    expect(farmProductSalesVolumeNeededForLevel(1)).toEqual(0)
    expect(farmProductSalesVolumeNeededForLevel(2)).toEqual(100)
    expect(farmProductSalesVolumeNeededForLevel(3)).toEqual(400)
    expect(farmProductSalesVolumeNeededForLevel(100)).toEqual(980100)
  })
})

describe('getLevelEntitlements', () => {
  test('calculates level entitlements', () => {
    jest.resetModules()
    jest.mock('./data/levels', () => ({
      levels: [
        { id: 0 },
        { id: 1 },
        { id: 2, unlocksShopItem: 'sample-item-1' },
        { id: 3, increasesSprinklerRange: true },
        { id: 4, unlocksShopItem: 'sample-item-2' },
        { id: 5, increasesSprinklerRange: true },
        { id: 6, unlocksShopItem: 'sample-item-3' },
      ],
    }))

    expect(jest.requireActual('./utils').getLevelEntitlements(4)).toEqual({
      items: {
        'sample-item-1': true,
        'sample-item-2': true,
      },
      sprinklerRange: 2,
    })
  })
})

describe('getAvailbleShopInventory', () => {
  test('computes shop inventory that has been unlocked', () => {
    jest.resetModules()
    jest.mock('./data/shop-inventory', () => [
      { id: 'sample-item-1' },
      { id: 'sample-item-2' },
    ])

    jest.mock('./data/levels', () => ({
      levels: [],
      unlockableItems: {
        'sample-item-1': true,
        'sample-item-2': true,
      },
    }))

    const { getAvailbleShopInventory } = jest.requireActual('./utils')

    expect(
      getAvailbleShopInventory({ items: { 'sample-item-1': true } })
    ).toEqual([{ id: 'sample-item-1' }])
  })
})

describe('getRandomLevelUpReward', () => {
  test('returns a crop item', () => {
    jest.resetModules()
    jest.mock('./data/levels', () => ({
      levels: [{ id: 0, unlocksShopItem: 'sample-crop-item-1' }],
      unlockableItems: {
        'sample-crop-item-1': true,
        'sample-crop-item-2': true,
      },
    }))
    jest.mock('./data/maps', () => ({
      itemsMap: {
        'sample-crop-item-1': {
          id: 'sample-crop-item-1',
          name: 'crop 1',
          type: 'CROP',
        },
      },
    }))
    jest.spyOn(Math, 'random').mockReturnValue(0)

    expect(jest.requireActual('./utils').getRandomLevelUpReward(2)).toEqual({
      id: 'sample-crop-item-1',
      name: 'crop 1',
      type: 'CROP',
    })
  })
})

describe('get7DayRevenueAverage', () => {
  test('calculates 7 day revenue average', () => {
    expect(get7DayRevenueAverage([])).toBe(0)
    expect(get7DayRevenueAverage([1, 1, 1, 1, 1, 1, 1])).toBe(1)
    expect(get7DayRevenueAverage([1, 2, 3, 4, 5, 6, 7])).toBe(4)
  })
})
