import {
  canMakeRecipe,
  castToMoney,
  computeMarketPositions,
  chooseRandom,
  dollarString,
  farmProductSalesVolumeNeededForLevel,
  farmProductsSold,
  generateCow,
  generateOffspringCow,
  get7DayAverage,
  getCowImage,
  getCowMilkRate,
  getCowFertilizerProductionRate,
  getCowValue,
  getCowWeight,
  getCropLifeStage,
  getCropLifecycleDuration,
  getFinalCropItemIdFromSeedItemId,
  getSeedItemIdFromFinalStageCropItemId,
  getItemCurrentValue,
  getLifeStageRange,
  getPlotContentFromItemId,
  getPlotImage,
  getPriceEventForCrop,
  getRangeCoords,
  getSalePriceMultiplier,
  integerString,
  isItemAFarmProduct,
  levelAchieved,
  maxYieldOfRecipe,
  moneyString,
  moneyTotal,
  percentageString,
  randomChoice,
} from './utils'
import { testCrop } from './test-utils'
import { items as itemImages, animals } from './img'
import { cowColors, cropLifeStage, genders, standardCowColors } from './enums'
import {
  sampleCropItem1,
  sampleCropSeedsItem1,
  craftedItem1,
  sampleItem1,
  sampleFieldTool1,
  milk1,
} from './data/items'
import {
  COW_FERTILIZER_PRODUCTION_RATE_FASTEST,
  COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
  COW_MAXIMUM_VALUE_MATURITY_AGE,
  COW_MAXIMUM_VALUE_MULTIPLIER,
  COW_MILK_RATE_FASTEST,
  COW_MILK_RATE_SLOWEST,
  COW_MINIMUM_VALUE_MULTIPLIER,
  COW_STARTING_WEIGHT_BASE,
  COW_STARTING_WEIGHT_VARIANCE,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  I_AM_RICH_BONUSES,
  MALE_COW_WEIGHT_MULTIPLIER,
} from './constants'

jest.mock('./data/maps')
jest.mock('./data/items')
jest.mock('./data/levels')
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

  describe('item is a crafted item', () => {
    test('returns correct result', () => {
      expect(isItemAFarmProduct(craftedItem1)).toBe(true)
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

describe('generateCow', () => {
  describe('randomizer: lower bound', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0)
    })

    const baseCowProperties = {
      color: Object.keys(standardCowColors)[0],
      daysOld: 1,
      id: '123',
      isBred: false,
      name: 'Peach',
    }

    describe('female cows', () => {
      test('generates a cow', () => {
        const baseWeight = Math.round(
          COW_STARTING_WEIGHT_BASE - COW_STARTING_WEIGHT_VARIANCE
        )

        expect(
          generateCow({ gender: genders.FEMALE, id: '123' })
        ).toMatchObject({
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

        expect(generateCow({ gender: genders.MALE, id: '123' })).toMatchObject({
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

      expect(generateCow({ id: '123' })).toMatchObject({
        baseWeight,
        color: Object.keys(standardCowColors).pop(),
        daysOld: 1,
        gender: Object.keys(genders).pop(),
        isBred: false,
        name: 'Peach',
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
    expect(generateOffspringCow(maleCow, femaleCow, 'foo')).toMatchObject({
      color: chooseRandom([femaleCow.color, maleCow.color]),
      colorsInBloodline: {
        [standardCowColors.GREEN]: true,
        [standardCowColors.ORANGE]: true,
        [standardCowColors.WHITE]: true,
        [standardCowColors.YELLOW]: true,
      },
      baseWeight: 2100,
      isBred: true,
      ownerId: 'foo',
      originalOwnerId: 'foo',
    })
  })

  test('order of parents does not matter', () => {
    const idProps = { id: '123' }

    const { ...offspring1 } = generateOffspringCow(
      maleCow,
      femaleCow,
      'foo',
      idProps
    )
    const { ...offspring2 } = generateOffspringCow(
      femaleCow,
      maleCow,
      'foo',
      idProps
    )

    expect(offspring1).toEqual(offspring2)
  })

  test('two cows of the same gender throw an error', () => {
    expect(() => generateOffspringCow(femaleCow, femaleCow, 'foo')).toThrow()
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

      expect(generateOffspringCow(maleCow, femaleCow, 'foo')).toMatchObject({
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
        isBred: true,
        ownerId: 'foo',
        originalOwnerId: 'foo',
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

      const { colorsInBloodline } = generateOffspringCow(
        maleCow,
        femaleCow,
        'foo'
      )

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

describe('getCowFertilizerProductionRate', () => {
  describe('non-male cows', () => {
    test('computes correct fertilizer production rate', () => {
      expect(
        getCowFertilizerProductionRate(
          generateCow({
            gender: genders.FEMALE,
          })
        )
      ).toEqual(Infinity)
    })
  })

  describe('male cows', () => {
    const baseCow = generateCow({ gender: genders.MALE })

    describe('minimal weightMultiplier', () => {
      test('computes correct fertilizer production rate', () => {
        expect(
          getCowFertilizerProductionRate({
            ...baseCow,
            weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
          })
        ).toEqual(COW_FERTILIZER_PRODUCTION_RATE_SLOWEST)
      })
    })

    describe('median weightMultiplier', () => {
      test('computes correct fertilizer production rate', () => {
        expect(
          getCowFertilizerProductionRate({ ...baseCow, weightMultiplier: 1 })
        ).toEqual(
          (COW_FERTILIZER_PRODUCTION_RATE_SLOWEST +
            COW_FERTILIZER_PRODUCTION_RATE_FASTEST) /
            2
        )
      })
    })

    describe('maximum weightMultiplier', () => {
      test('computes correct fertilizer production rate', () => {
        expect(
          getCowFertilizerProductionRate({
            ...baseCow,
            weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM,
          })
        ).toEqual(COW_FERTILIZER_PRODUCTION_RATE_FASTEST)
      })
    })
  })
})

describe('getCowValue', () => {
  const baseWeight = 100

  test('computes value of cow for sale', () => {
    expect(getCowValue(generateCow({ baseWeight, daysOld: 1 }))).toEqual(
      baseWeight * 1.5
    )
  })

  describe('computing sale value', () => {
    describe('young cow (worst value)', () => {
      test('computes cow value', () => {
        expect(
          getCowValue(generateCow({ baseWeight, daysOld: 1 }), true)
        ).toEqual(baseWeight * COW_MINIMUM_VALUE_MULTIPLIER)
      })
    })

    describe('old cow (best value)', () => {
      test('computes cow value', () => {
        expect(
          getCowValue(
            generateCow({
              baseWeight,
              daysOld: COW_MAXIMUM_VALUE_MATURITY_AGE,
            }),
            true
          )
        ).toEqual(baseWeight * COW_MAXIMUM_VALUE_MULTIPLIER)
      })
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
      itemImages['sample-crop-1-seed']
    )
    expect(getPlotImage(testCrop({ itemId, daysWatered: 1 }))).toBe(
      itemImages['sample-crop-1-growing']
    )
    expect(getPlotImage(testCrop({ itemId, daysWatered: 3 }))).toBe(
      itemImages['sample-crop-1']
    )
  })

  test('returns item image for oreId', () => {
    expect(getPlotImage(getPlotContentFromItemId('sample-ore-1'))).toBe(
      itemImages['sample-ore-1']
    )
  })

  test('returns item image for other content', () => {
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
    expect(getFinalCropItemIdFromSeedItemId('sample-crop-1-seed')).toEqual(
      'sample-crop-1'
    )
  })
})

describe('getSeedItemIdFromFinalStageCropItemId', () => {
  test('gets seed item from crop item', () => {
    expect(getSeedItemIdFromFinalStageCropItemId('sample-crop-1')).toEqual(
      'sample-crop-1-seed'
    )
  })

  test('handles invalid crop id input', () => {
    expect(getSeedItemIdFromFinalStageCropItemId('nonexistent-crop')).toEqual(
      undefined
    )
  })
})

describe('maxYieldOfRecipe', () => {
  test('returns yield for no ingredients', () => {
    expect(
      maxYieldOfRecipe({ ingredients: { 'sample-item-1': 2 } }, [])
    ).toEqual(0)
  })

  test('returns yield for some ingredients', () => {
    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } },
        [{ id: 'sample-item-1', quantity: 2 }]
      )
    ).toEqual(0)

    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } },
        [
          { id: 'sample-item-1', quantity: 1 },
          { id: 'sample-item-2', quantity: 2 },
        ]
      )
    ).toEqual(0)

    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } },
        [
          { id: 'sample-item-1', quantity: 4 },
          { id: 'sample-item-2', quantity: 3 },
        ]
      )
    ).toEqual(1)
  })

  test('returns yield for all ingredients', () => {
    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } },
        [
          { id: 'sample-item-1', quantity: 2 },
          { id: 'sample-item-2', quantity: 2 },
        ]
      )
    ).toEqual(1)

    expect(
      maxYieldOfRecipe(
        { ingredients: { 'sample-item-1': 2, 'sample-item-2': 2 } },
        [
          { id: 'sample-item-1', quantity: 4 },
          { id: 'sample-item-2', quantity: 4 },
        ]
      )
    ).toEqual(2)
  })
})

describe('canMakeRecipe', () => {
  describe('player does not have sufficient ingredients', () => {
    test('evaluates inventory correctly', () => {
      expect(
        canMakeRecipe(
          { ingredients: { 'sample-item-1': 2 } },
          [{ id: 'sample-item-1', quantity: 1 }],
          1
        )
      ).toBe(false)
    })
  })

  describe('player does have sufficient ingredients', () => {
    test('evaluates inventory correctly', () => {
      expect(
        canMakeRecipe(
          { ingredients: { 'sample-item-1': 2 } },
          [{ id: 'sample-item-1', quantity: 2 }],
          1
        )
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
  let entitlements = null

  beforeEach(() => {
    jest.resetModules()
    jest.mock('./data/levels', () => ({
      levels: [
        { id: 0 },
        { id: 1 },
        { id: 2, unlocksShopItem: 'sample-item-1' },
        { id: 3, increasesSprinklerRange: true },
        { id: 4, unlocksShopItem: 'sample-item-2' },
        { id: 5, unlocksTool: 'shovel' },
        { id: 6, increasesSprinklerRange: true },
        { id: 7, unlocksShopItem: 'sample-item-3' },
      ],
    }))

    entitlements = jest.requireActual('./utils').getLevelEntitlements(5)
  })

  test('calculates level entitlements', () => {
    expect(entitlements).toEqual({
      items: {
        'sample-item-1': true,
        'sample-item-2': true,
      },
      sprinklerRange: 2,
      tools: {
        shovel: true,
      },
    })
  })
})

describe('getAvailableShopInventory', () => {
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

    const { getAvailableShopInventory } = jest.requireActual('./utils')

    expect(
      getAvailableShopInventory({ items: { 'sample-item-1': true } })
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

describe('get7DayAverage', () => {
  test('calculates 7 day revenue average', () => {
    expect(get7DayAverage([])).toBe(0)
    expect(get7DayAverage([-1, -1, -1, -1, -1, -1, -1])).toBe(-1)
    expect(get7DayAverage([1, 1, 1, 1, 1, 1, 1])).toBe(1)
    expect(get7DayAverage([1, 2, 3, 4, 5, 6, 7])).toBe(4)
  })
})

describe('computeMarketPositions', () => {
  test('computes day positions', () => {
    expect(
      computeMarketPositions(
        { 'sample-item-1': 10, 'sample-item-2': 5, 'sample-item-3': 0 },
        {},
        [
          { id: 'sample-item-1', quantity: 5 },
          { id: 'sample-item-2', quantity: 10 },
          { id: 'sample-item-3', quantity: 0 },
          { id: 'sample-item-4', quantity: 10 },
        ]
      )
    ).toEqual({
      'sample-item-1': -1,
      'sample-item-2': 1,
      'sample-item-4': 1,
    })

    expect(
      computeMarketPositions(
        {},
        { 'sample-item-1': 10, 'sample-item-2': 5, 'sample-item-3': 0 },
        [
          { id: 'sample-item-1', quantity: 5 },
          { id: 'sample-item-2', quantity: 10 },
          { id: 'sample-item-3', quantity: 0 },
          { id: 'sample-item-4', quantity: 10 },
        ]
      )
    ).toEqual({
      'sample-item-1': -1,
      'sample-item-2': 1,
      'sample-item-4': 1,
    })

    expect(
      computeMarketPositions(
        {
          'sample-item-1': 5,
          'sample-item-2': 5,
          'sample-item-3': 5,
          'sample-item-4': 0,
          'sample-item-5': 10,
        },
        {
          'sample-item-1': 10,
          'sample-item-2': 5,
          'sample-item-3': 0,
          'sample-item-4': 5,
          'sample-item-6': 10,
        },
        [
          { id: 'sample-item-1', quantity: 5 },
          { id: 'sample-item-2', quantity: 10 },
          { id: 'sample-item-3', quantity: 0 },
          { id: 'sample-item-4', quantity: 0 },
          { id: 'sample-item-5', quantity: 5 },
          { id: 'sample-item-6', quantity: 5 },
        ]
      )
    ).toEqual({
      'sample-item-2': 1,
      'sample-item-3': -1,
      'sample-item-5': -1,
      'sample-item-6': -1,
    })
  })
})

const percentageStringTests = [
  [0.5, '50%'],
  [0.05, '5%'],
  [1, '100%'],
  [10, '1000%'],
  [-0.3, '-30%'],
]

describe.each(percentageStringTests)(
  'percentageString',
  (percent, expectedString) => {
    test(`it converts ${percent} to a ${expectedString}`, () => {
      expect(percentageString(percent)).toEqual(expectedString)
    })
  }
)

describe('getSalePriceMultiplier', () => {
  test('it returns 1 when there are no completedAchievements', () => {
    expect(getSalePriceMultiplier({})).toEqual(1)
  })

  test('it returns 1 when there are no relevant completedAchievements', () => {
    const completedAchievements = {
      irrelevant: true,
      'also-irrelevant': true,
    }

    expect(getSalePriceMultiplier(completedAchievements)).toEqual(1)
  })

  const iAmRichAchievements = [
    ['i-am-rich-1', 1 + I_AM_RICH_BONUSES[0]],
    ['i-am-rich-2', 1 + I_AM_RICH_BONUSES[1]],
    ['i-am-rich-3', 1 + I_AM_RICH_BONUSES[2]],
  ]

  describe.each(iAmRichAchievements)(
    'with I am Rich achievements completed',
    (achievementId, expectedMultiplier) => {
      test(`${achievementId} returns ${expectedMultiplier}`, () => {
        const completedAchievements = {
          [achievementId]: true,
        }

        expect(getSalePriceMultiplier(completedAchievements)).toEqual(
          expectedMultiplier
        )
      })
    }
  )
})

describe('randomChoice', () => {
  const choices = [
    { weight: 0.2, name: 'first-choice' },
    { weight: 0.5, name: 'second-choice' },
    { weight: 0.3, name: 'third-choice' },
  ]

  beforeEach(() => {
    jest.spyOn(global.Math, 'random')
  })

  test('it returns a choice at random', () => {
    const choice = randomChoice(choices)
    expect(choices.includes(choice)).toEqual(true)
  })

  test('it can handle the lower bound of Math.random', () => {
    global.Math.random.mockReturnValueOnce(0)
    const choice = randomChoice(choices)
    expect(choice).toEqual(choices[0])
  })

  test('it can handle the upper bound of Math.random', () => {
    global.Math.random.mockReturnValueOnce(0.99)
    const choice = randomChoice(choices)
    expect(choice).toEqual(choices[2])
  })
})

describe('getCowImage', () => {
  test('colors a cow template image', async () => {
    const cow = generateCow({ color: cowColors.GREEN, id: '1' })
    const image = await getCowImage(cow)

    // image data can viewed with https://jaredwinick.github.io/base64-image-viewer/
    expect(image).toMatchSnapshot()
  })

  test('does not modify rainbow cow image', async () => {
    const cow = generateCow({ color: cowColors.RAINBOW })
    const image = await getCowImage(cow)

    expect(image).toEqual(animals.cow.rainbow)
  })
})
