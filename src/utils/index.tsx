import { Buffer } from 'buffer'

import configureJimp from '@jimp/custom'
import jimpPng from '@jimp/png'
import { dinero, toDecimal, USD } from 'dinero.js'
import { funAnimalName } from 'fun-animal-names'
import sortBy from 'lodash.sortby'
import { v4 as uuid } from 'uuid'

import { random } from '../common/utils.js'
import {
  BREAKPOINTS,
  COW_COLORS_HEX_MAP,
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
  DAILY_FINANCIAL_HISTORY_RECORD_LENGTH,
  HUGGING_MACHINE_ITEM_ID,
  I_AM_RICH_BONUSES,
  INFINITE_STORAGE_LIMIT,
  INITIAL_FIELD_HEIGHT,
  INITIAL_FIELD_WIDTH,
  INITIAL_FOREST_HEIGHT,
  INITIAL_FOREST_WIDTH,
  INITIAL_STORAGE_LIMIT,
  LARGEST_PURCHASABLE_FIELD_SIZE,
  MALE_COW_WEIGHT_MULTIPLIER,
  PEER_METADATA_STATE_KEYS,
  PERSISTED_STATE_KEYS,
  PRECIPITATION_CHANCE,
  PRICE_EVENT_STANDARD_DURATION_DECREASE,
  STANDARD_VIEW_LIST,
  STORAGE_EXPANSION_AMOUNT,
  STORAGE_EXPANSION_BASE_PRICE,
  STORAGE_EXPANSION_SCALE_PREMIUM,
  STORM_CHANCE,
} from '../constants.js'
import fruitNames from '../data/fruit-names.js'
import {
  chocolateMilk,
  milk1,
  milk2,
  milk3,
  rainbowMilk1,
  rainbowMilk2,
  rainbowMilk3,
} from '../data/items.js'
import { unlockableItems } from '../data/levels.js'
import { cropItemIdToSeedItemMap, itemsMap } from '../data/maps.js'
import cowShopInventory from '../data/shop-inventory-cow.js'
import shopInventory from '../data/shop-inventory.js'
import {
  cowColors,
  cropLifeStage,
  fertilizerType,
  genders,
  itemType,
  stageFocusType,
  standardCowColors,
} from '../enums.js'
import { animals, items as itemImages, pixel } from '../img/index.js'

import { farmProductsSold } from './farmProductsSold.js'
import { getCropLifecycleDuration } from './getCropLifecycleDuration.js'
import { getInventoryQuantityMap } from './getInventoryQuantityMap.js'
import { getItemBaseValue } from './getItemBaseValue.js'
import { getLevelEntitlements } from './getLevelEntitlements.js'
import { memoize } from './memoize.js'

const Jimp = configureJimp({
  types: [jimpPng],
})

const { SEED, GROWING, GROWN } = cropLifeStage

const isPlotContent = (obj: any = {}): obj is farmhand.plotContent =>
  Boolean(obj && obj['itemId'] && obj['fertilizerType'])

const isShoveledPlot = (obj: any = {}): obj is farmhand.shoveledPlot =>
  Boolean(obj && obj['isShoveled'] && obj['daysUntilClear'])

const purchasableItemMap = [...cowShopInventory, ...shopInventory].reduce(
  (acc: Record<string, farmhand.item>, item) => {
    acc[item.id] = item
    return acc
  },
  {}
)

export const chooseRandomIndex = (list: any[]): number =>
  Math.round(random() * (list.length - 1))

export const chooseRandom = (list: any[]): any => list[chooseRandomIndex(list)]

/**
 * Ensures that the condition argument to memoize() is not ignored, per
 * https://github.com/caiogondim/fast-memoize.js#function-arguments
 *
 * Pass this is the `serializer` option to any memoize()-ed functions that
 * accept function arguments.
 */
export const memoizationSerializer = (args: any[]) =>
  JSON.stringify(
    [...args].map(arg => (typeof arg === 'function' ? arg.toString() : arg))
  )

export const clampNumber = (num: number, min: number, max: number) =>
  num <= min ? min : num >= max ? max : num

export const castToMoney = (num: number) => Math.round(num * 100) / 100

/**
 * Safely adds dollar figures to avoid IEEE 754 rounding errors.
 * @param args Numbers that represent money values.
 * @see ://adripofjavascript.com/blog/drips/avoiding-problems-with-decimal-math-in-javascript.html
 */
export const moneyTotal = (...args: number[]): number =>
  args.reduce((sum, num) => (sum += Math.round(num * 100)), 0) / 100

/**
 * Based on https://stackoverflow.com/a/14224813/470685
 * @param value Number to scale
 * @param min Non-standard minimum
 * @param max Non-standard maximum
 * @param baseMin Standard minimum
 * @param baseMax Standard maximum
 */
export const scaleNumber = (
  value: number,
  min: number,
  max: number,
  baseMin: number,
  baseMax: number
): number => ((value - min) * (baseMax - baseMin)) / (max - min) + baseMin

const convertStringToInteger = (string: string): number =>
  string.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * i, 0)

export const createNewField = () =>
  new Array(INITIAL_FIELD_HEIGHT)
    .fill(undefined)
    .map(() => new Array(INITIAL_FIELD_WIDTH).fill(null))

export const createNewForest = () => {
  return new Array(INITIAL_FOREST_HEIGHT)
    .fill(undefined)
    .map(() => new Array(INITIAL_FOREST_WIDTH).fill(null))
}

/**
 * @param number Include dollar sign and other formatting. Cents are
rounded off.
 */
export const dollarString = (number: number): string =>
  toDecimal(
    dinero({ amount: Math.round(number), currency: USD, scale: 0 }),
    ({ value }) =>
      Number(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
  )

/**
 * @param number Number string with commas.
 */
export const integerString = (number: number): string =>
  toDecimal(
    dinero({ amount: Math.round(number), currency: USD, scale: 0 }),
    ({ value }) => Number(value).toLocaleString('en-US')
  )

/**
 * @param number A float
 */
export const percentageString = (number: number): string =>
  `${Math.round(number * 100)}%`

export const getItemCurrentValue = (
  { id }: farmhand.item,
  valueAdjustments: Record<string, number>
): number => {
  const amount = Math.round(
    (valueAdjustments[id]
      ? getItemBaseValue(id) *
        (itemsMap[id].doesPriceFluctuate ? valueAdjustments[id] : 1)
      : getItemBaseValue(id)) * 100
  )

  return Number(toDecimal(dinero({ amount, currency: USD })))
}

/**
 * @returns Rounded to a money value.
 */
export const getAdjustedItemValue = (
  valueAdjustments: Record<string, number>,
  itemId: string
): number =>
  Number(((valueAdjustments[itemId] || 1) * itemsMap[itemId].value).toFixed(2))

export const isItemSoldInShop = ({ id }: farmhand.item): boolean =>
  Boolean(purchasableItemMap[id])

export const getResaleValue = ({ id }: farmhand.item): number =>
  itemsMap[id].value / 2

export const getPlotContentFromItemId = (
  itemId: string
): farmhand.plotContent => ({
  itemId,
  fertilizerType: fertilizerType.NONE,
})

export const getCropFromItemId = (itemId: string): farmhand.crop => ({
  ...getPlotContentFromItemId(itemId),
  daysOld: 0,
  daysWatered: 0,
  wasWateredToday: false,
})

export const getPlotContentType = ({
  itemId,
}: farmhand.plotContent): string | null =>
  itemId ? itemsMap[itemId].type : null

export const doesPlotContainCrop = (
  plot: farmhand.plotContent | null
): plot is farmhand.crop =>
  plot !== null && getPlotContentType(plot) === itemType.CROP

export const getLifeStageRange = memoize((cropTimeline: number[]) => {
  let lifeStageRange = Array(cropTimeline[0]).fill(SEED)

  lifeStageRange = lifeStageRange.concat(
    cropTimeline
      .slice(1)
      .reduce(
        (acc: Array<string | number>, value) =>
          acc.concat(Array(value).fill(GROWING)),
        []
      )
  )

  return lifeStageRange
}, {})

export const getGrowingPhase = memoize(
  (crop: farmhand.crop) => {
    const { itemId, daysWatered = 0 } = crop
    const { cropTimeline = [] } = itemsMap[itemId]

    let daysGrowing = daysWatered + 1
    let phase = 0

    for (let value of cropTimeline) {
      if (daysGrowing - value <= 0) break

      daysGrowing -= value
      phase += 1
    }

    return phase
  },
  {
    cacheSize:
      (LARGEST_PURCHASABLE_FIELD_SIZE as { columns: number }).columns *
      (LARGEST_PURCHASABLE_FIELD_SIZE as { rows: number }).rows,
  }
)

export const getCropLifeStage = (
  crop: farmhand.crop
): farmhand.cropLifeStage => {
  const { itemId, daysWatered = 0 } = crop
  const { cropTimeline } = itemsMap[itemId]

  if (!cropTimeline) {
    throw new Error(`${itemId} has no cropTimeline`)
  }

  return getLifeStageRange(cropTimeline)[Math.floor(daysWatered)] || GROWN
}

export const getPlotImage = (
  plotContents: farmhand.plotContent | farmhand.shoveledPlot | null,
  x: number,
  y: number
): string | null => {
  if (isPlotContent(plotContents)) {
    if (isPlotContentACrop(plotContents)) {
      let itemImageId
      switch (getCropLifeStage(plotContents)) {
        case GROWN:
          itemImageId = plotContents.itemId
          break

        case GROWING:
          const phase = getGrowingPhase(plotContents)
          itemImageId = `${plotContents.itemId}-growing-${phase}`
          break

        default:
          const seedItem = cropItemIdToSeedItemMap[plotContents.itemId]
          itemImageId = seedItem.id
      }

      return itemImages[itemImageId]
    }

    if (getPlotContentType(plotContents) === itemType.WEED) {
      const weedColors = ['yellow', 'orange', 'pink']
      const color = weedColors[(x * y) % weedColors.length]

      return itemImages[`weed-${color}`]
    }

    // Handle other plot content (non-crop, non-weed)
    return itemImages[(plotContents as farmhand.plotContent).itemId]
  }

  if (isShoveledPlot(plotContents)) {
    if (plotContents?.oreId) {
      return itemImages[plotContents.oreId]
    }
  }

  return null
}

export const getRangeCoords = (
  rangeSize: number,
  centerX: number,
  centerY: number
) => {
  const squareSize = 2 * rangeSize + 1
  const rangeStartX = centerX - rangeSize
  const rangeStartY = centerY - rangeSize

  return new Array(squareSize).fill(null).map((_, yIndex) =>
    new Array(squareSize).fill(null).map((__, xIndex) => ({
      x: rangeStartX + xIndex,
      y: rangeStartY + yIndex,
    }))
  )
}

export const getFinalCropItemFromSeedItem = (
  { id }: { id: string },
  variantIdx: number = 0
): farmhand.item | undefined => {
  const itemId = getFinalCropItemIdFromSeedItemId(id, variantIdx)

  if (itemId) return itemsMap[itemId]
}

export const getFinalCropItemIdFromSeedItemId = (
  seedItemId: string,
  variationIdx: number = 0
): string | undefined => {
  const { growsInto } = itemsMap[seedItemId]

  if (Array.isArray(growsInto)) {
    return growsInto[variationIdx]
  } else {
    return growsInto
  }
}

export const getSeedItemIdFromFinalStageCropItemId = memoize(
  (cropItemId: string) => {
    const seedItemId = Object.values(
      itemsMap as Record<string, { id?: string; growsInto?: string | string[] }>
    ).find(item => {
      const { growsInto } = item as { growsInto?: string | string[] }
      if (Array.isArray(growsInto)) {
        return growsInto.includes(cropItemId)
      } else {
        return growsInto === cropItemId
      }
    })?.id

    if (!seedItemId)
      throw new Error(
        `Crop item ID ${cropItemId} does not have a corresponding seed`
      )

    return seedItemId
  },
  {
    cacheSize: Object.keys(itemsMap).length,
  }
)

const getDefaultCowName = ({ id }: { id: string }): string =>
  fruitNames[convertStringToInteger(id) % fruitNames.length]

export const getCowDisplayName = (
  cow: farmhand.cow,
  playerId: string,
  allowCustomPeerCowNames: boolean
): string => {
  return cow.originalOwnerId !== playerId && !allowCustomPeerCowNames
    ? getDefaultCowName(cow)
    : cow.name
}

/**
 * Generates a friendly cow.
 */
export const generateCow = (
  options: {
    gender?: farmhand.cow['gender']
    color?: farmhand.cow['color']
    id?: farmhand.cow['id']
    [key: string]: any
  } = {}
): farmhand.cow => {
  const gender =
    (options.gender as farmhand.cow['gender']) ||
    chooseRandom(Object.values(genders))
  const color =
    (options.color as farmhand.cow['color']) ||
    chooseRandom(Object.values(standardCowColors))
  const id = (options.id as farmhand.cow['id']) || uuid()

  const baseWeight = Math.round(
    COW_STARTING_WEIGHT_BASE *
      (gender === genders.MALE ? MALE_COW_WEIGHT_MULTIPLIER : 1) -
      COW_STARTING_WEIGHT_VARIANCE +
      random() * (COW_STARTING_WEIGHT_VARIANCE * 2)
  )

  const cow: farmhand.cow = {
    baseWeight,
    color,
    colorsInBloodline: {
      [color]: true,
    } as Record<farmhand.cowColors, boolean>,
    daysOld: 1,
    daysSinceMilking: 0,
    daysSinceProducingFertilizer: 0,
    gender,
    happiness: 0,
    happinessBoostsToday: 0,
    id,
    isBred: false,
    isUsingHuggingMachine: false,
    name: '',
    ownerId: '',
    originalOwnerId: '',
    timesTraded: 0,
    weightMultiplier: 1,
    ...options,
  }

  cow.name = getDefaultCowName(cow)

  return cow
}

/**
 * Generates a cow based on two parents.
 */
export const generateOffspringCow = (
  cow1: farmhand.cow,
  cow2: farmhand.cow,
  ownerId: string,
  customProps = {}
): farmhand.cow => {
  if (cow1.gender === cow2.gender) {
    throw new Error(
      `${JSON.stringify(cow1)} ${JSON.stringify(
        cow2
      )} cannot produce offspring because they have the same gender`
    )
  }

  const maleCow = cow1.gender === genders.MALE ? cow1 : cow2
  const femaleCow = cow1.gender === genders.MALE ? cow2 : cow1
  const colorsInBloodline: Partial<Record<farmhand.cowColors, boolean>> = {
    // These lines are for backwards compatibility and can be removed on 11/1/2020
    [maleCow.color]: true,
    [femaleCow.color]: true,
    // End backwards compatibility lines to remove
    ...maleCow.colorsInBloodline,
    ...femaleCow.colorsInBloodline,
  }

  delete colorsInBloodline[cowColors.RAINBOW]

  const isRainbowCow =
    Object.keys(colorsInBloodline).length ===
    Object.keys(standardCowColors).length

  return generateCow({
    color: isRainbowCow
      ? cowColors.RAINBOW
      : chooseRandom([femaleCow.color, maleCow.color]),
    colorsInBloodline,
    baseWeight: (maleCow.baseWeight + femaleCow.baseWeight) / 2,
    isBred: true,
    ownerId,
    originalOwnerId: ownerId,
    ...customProps,
  })
}

export const getCowMilkItem = ({
  color,
  happiness,
}: {
  color: farmhand.cowColors
  happiness: number
}): farmhand.item => {
  if (color === cowColors.BROWN) {
    return chocolateMilk
  }

  const isRainbowCow = color === cowColors.RAINBOW

  if (happiness < 1 / 3) {
    return isRainbowCow ? rainbowMilk1 : milk1
  } else if (happiness < 2 / 3) {
    return isRainbowCow ? rainbowMilk2 : milk2
  }

  return isRainbowCow ? rainbowMilk3 : milk3
}

export const getCowFertilizerItem = ({
  color,
}: {
  color: farmhand.cowColors
}): farmhand.item =>
  itemsMap[color === cowColors.RAINBOW ? 'rainbow-fertilizer' : 'fertilizer']

export const getCowMilkRate = (cow: farmhand.cow): number =>
  cow.gender === genders.FEMALE
    ? scaleNumber(
        cow.weightMultiplier,
        COW_WEIGHT_MULTIPLIER_MINIMUM,
        COW_WEIGHT_MULTIPLIER_MAXIMUM,
        COW_MILK_RATE_SLOWEST,
        COW_MILK_RATE_FASTEST
      )
    : Infinity

export const getCowFertilizerProductionRate = (cow: farmhand.cow): number =>
  cow.gender === genders.MALE
    ? scaleNumber(
        cow.weightMultiplier,
        COW_WEIGHT_MULTIPLIER_MINIMUM,
        COW_WEIGHT_MULTIPLIER_MAXIMUM,
        COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
        COW_FERTILIZER_PRODUCTION_RATE_FASTEST
      )
    : Infinity

export const getCowWeight = ({
  baseWeight,
  weightMultiplier,
}: {
  baseWeight: number
  weightMultiplier: number
}): number => Math.round(baseWeight * weightMultiplier)

export const getCowValue = (
  cow: farmhand.cow,
  computeSaleValue: boolean = false
): number =>
  computeSaleValue
    ? getCowWeight(cow) *
      clampNumber(
        scaleNumber(
          cow.daysOld,
          1,
          COW_MAXIMUM_VALUE_MATURITY_AGE,
          COW_MINIMUM_VALUE_MULTIPLIER,
          COW_MAXIMUM_VALUE_MULTIPLIER
        ),
        COW_MINIMUM_VALUE_MULTIPLIER,
        COW_MAXIMUM_VALUE_MULTIPLIER
      )
    : getCowWeight(cow) * 1.5

export const getCowSellValue = (cow: farmhand.cow) => getCowValue(cow, true)

export const maxYieldOfRecipe = memoize(
  (
    { ingredients }: farmhand.recipe,
    inventory: Array<{ id: string; quantity: number }>
  ) => {
    const inventoryQuantityMap = getInventoryQuantityMap(inventory)

    return (
      Math.min(
        ...Object.keys(ingredients).map(itemId =>
          Math.floor(inventoryQuantityMap[itemId] / ingredients[itemId])
        )
      ) || 0
    )
  },
  {}
)

export const canMakeRecipe = (
  recipe: farmhand.recipe,
  inventory: Array<{ id: string; quantity: number }>,
  howMany: number
): boolean => maxYieldOfRecipe(recipe, inventory) >= howMany

export const filterItemIdsToSeeds = (itemsIds: string[]): string[] =>
  itemsIds.filter(id => itemsMap[id]?.type === itemType.CROP)

export const getRandomUnlockedCrop = (
  unlockedSeedItemIds: Array<string>
): farmhand.item => {
  const seedItemId = chooseRandom(unlockedSeedItemIds)
  const seedItem = itemsMap[seedItemId]
  const variationIdx = Array.isArray(seedItem.growsInto)
    ? chooseRandomIndex(seedItem.growsInto)
    : 0

  const finalCropItemId = getFinalCropItemIdFromSeedItemId(
    seedItemId,
    variationIdx
  )

  if (!finalCropItemId)
    throw new Error(
      `Seed item ID ${seedItemId} has no corresponding final crop ID`
    )

  return itemsMap[finalCropItemId]
}

export const getPriceEventForCrop = (
  cropItem: farmhand.item
): farmhand.priceEvent => ({
  itemId: cropItem.id,
  daysRemaining:
    getCropLifecycleDuration(cropItem as any) -
    PRICE_EVENT_STANDARD_DURATION_DECREASE,
})

export const doesMenuObstructStage = () => window.innerWidth < BREAKPOINTS.MD

const itemTypesToShowInReverse: Set<farmhand.itemType> = new Set([
  itemType.MILK,
])

const sortItemIdsByTypeAndValue = memoize(
  (itemIds: string[]) =>
    sortBy(itemIds, [
      id => Number(itemsMap[id].type !== itemType.CROP),
      id => {
        const { type, value } = itemsMap[id]
        return itemTypesToShowInReverse.has(type) ? -value : value
      },
    ]),
  {}
)

export const sortItems = (
  items: Array<farmhand.item>
): Array<farmhand.item> => {
  const map: Record<string, farmhand.item> = {}
  items.forEach(item => (map[item.id] = item))

  return sortItemIdsByTypeAndValue(items.map(({ id }) => id)).map(id => map[id])
}

export const inventorySpaceConsumed = memoize(
  (inventory: Array<{ quantity?: number }>): number =>
    inventory.reduce((sum, { quantity = 0 }) => sum + quantity, 0),
  {}
)

export const inventorySpaceRemaining = ({
  inventory,
  inventoryLimit,
}: Pick<farmhand.state, 'inventory' | 'inventoryLimit'>): number =>
  inventoryLimit === INFINITE_STORAGE_LIMIT
    ? Infinity
    : Math.max(0, inventoryLimit - inventorySpaceConsumed(inventory))

export const doesInventorySpaceRemain = (
  state: Pick<farmhand.state, 'inventory' | 'inventoryLimit'>
): boolean => inventorySpaceRemaining(state) > 0

export const areHuggingMachinesInInventory = memoize(
  (inventory: farmhand.state['inventory']): boolean =>
    inventory.some(({ id }) => id === HUGGING_MACHINE_ITEM_ID)
)

export const nullArray = memoize(
  (arraySize: number) => Object.freeze(new Array(arraySize).fill(null)),
  {
    cacheSize: 30,
  }
)

export const findCowById = memoize(
  (cowInventory: Array<farmhand.cow>, id: string): farmhand.cow | undefined =>
    cowInventory.find(cow => id === cow.id)
)

export const experienceNeededForLevel = (targetLevel: number): number =>
  ((targetLevel - 1) * 10) ** 2

export const getAvailableShopInventory = memoize(
  (levelEntitlements: { items: Record<string, boolean> }) =>
    shopInventory.filter(
      ({ id }) =>
        !(
          unlockableItems.hasOwnProperty(id) &&
          !levelEntitlements.items.hasOwnProperty(id)
        )
    )
)

/**
 * @returns Will always be a crop seed item.
 */
export const getRandomLevelUpReward = (level: number): farmhand.item =>
  itemsMap[
    chooseRandom(
      filterItemIdsToSeeds(Object.keys(getLevelEntitlements(level).items))
    )
  ]

export const getRandomLevelUpRewardQuantity = (level: number): number =>
  level * 10

/**
 * @returns Data that is meant to be shared with Trystero peers.
 */
export const getPeerMetadata = (
  state: farmhand.state
): farmhand.peerMetadata => {
  const reducedState = PEER_METADATA_STATE_KEYS.reduce((acc: any, key) => {
    acc[key] = state[key as keyof farmhand.state]

    return acc
  }, {})

  Object.assign(reducedState, {
    cowOfferedForTrade: state.cowInventory.find(
      ({ id }) => id === state.cowIdOfferedForTrade
    ),
  })

  return reducedState as farmhand.peerMetadata
}

/**
 * @returns A version of `state` that only contains keys of
farmhand.state data that should be persisted.
 */
export const reduceByPersistedKeys = (
  state: Partial<farmhand.state>
): farmhand.state =>
  PERSISTED_STATE_KEYS.reduce((acc: any, key) => {
    // This check prevents old exports from corrupting game state when
    // imported.
    if (typeof state[key as keyof farmhand.state] !== 'undefined') {
      acc[key] = state[key as keyof farmhand.state]
    }

    return acc
  }, {}) as farmhand.state

/**
 * @param historicalData Must be no longer than 7 numbers long.
 */
export const get7DayAverage = (historicalData: Array<number>): number =>
  historicalData.reduce((sum, revenue) => moneyTotal(sum, revenue), 0) /
  DAILY_FINANCIAL_HISTORY_RECORD_LENGTH

const cowColorToIdMap: Record<farmhand.cowColors, string> = {
  [cowColors.BLUE]: 'blue',
  [cowColors.BROWN]: 'brown',
  [cowColors.GREEN]: 'green',
  [cowColors.ORANGE]: 'orange',
  [cowColors.PURPLE]: 'purple',
  [cowColors.RAINBOW]: 'rainbow',
  [cowColors.WHITE]: 'white',
  [cowColors.YELLOW]: 'yellow',
}

export const getCowColorId = ({ color }: { color: farmhand.cowColors }) =>
  `${cowColorToIdMap[color]}-cow`

export const getProfit = (revenue: number, losses: number): number =>
  moneyTotal(revenue, losses)

export const getProfitRecord = (
  recordSingleDayProfit: number,
  todaysRevenue: number,
  todaysLosses: number
): number =>
  Math.max(recordSingleDayProfit, getProfit(todaysRevenue, todaysLosses))

/**
 * @return Keys are item IDs, values are either 1 or -1.
 */
export const computeMarketPositions = (
  todaysStartingInventory: farmhand.state['todaysStartingInventory'],
  todaysPurchases: farmhand.state['todaysPurchases'],
  inventory: Array<{ id: string; quantity: number }>
): any =>
  inventory.reduce((acc: any, { id, quantity: endingPosition }) => {
    const startingInventory = todaysStartingInventory[id] || 0
    const purchaseQuantity = todaysPurchases[id] || 0

    if (!itemsMap[id].doesPriceFluctuate) {
      return acc
    }

    if (startingInventory !== endingPosition) {
      if (
        endingPosition < startingInventory ||
        endingPosition < purchaseQuantity
      ) {
        acc[id] = -1
      } else if (
        endingPosition > startingInventory ||
        endingPosition > purchaseQuantity
      ) {
        acc[id] = 1
      }
    }

    return acc
  }, {})

export const transformStateDataForImport = (
  state: farmhand.state
): farmhand.state => {
  let sanitizedState: any = { ...state }

  const rejectedKeys = ['version']
  rejectedKeys.forEach(rejectedKey => delete sanitizedState[rejectedKey])

  if (sanitizedState.experience === 0) {
    sanitizedState.experience = farmProductsSold(sanitizedState.itemsSold || {})
  }

  if (
    sanitizedState.showHomeScreen === false &&
    sanitizedState.stageFocus === stageFocusType.HOME
  ) {
    sanitizedState = {
      ...sanitizedState,
      stageFocus: STANDARD_VIEW_LIST[0] as farmhand.stageFocusType,
    }
  }

  // NOTE: This is a mitigation for
  // https://github.com/jeremyckahn/farmhand/issues/546. There's no expected
  // scenario where a cow would be present in cowBreedingPen but not
  // cowInventory, but at least one player's game somehow got into that state.
  // This block detects such an invalid state and corrects it.
  {
    const { cowId1, cowId2 } = sanitizedState.cowBreedingPen

    const cowPenIdMap = (sanitizedState.cowInventory as farmhand.cow[]).reduce(
      (acc: Record<string, farmhand.cow>, cow: farmhand.cow) => {
        acc[cow.id] = cow

        return acc
      },
      {}
    )

    const isCowInBreedingPenMissingFromInventory = [cowId1, cowId2].some(
      cowId => {
        return cowId && !(cowId in cowPenIdMap)
      }
    )

    if (isCowInBreedingPenMissingFromInventory) {
      // Resets cowBreedingPen state
      sanitizedState.cowBreedingPen = {
        cowId1: null,
        cowId2: null,
        daysUntilBirth: -1,
      }
    }
  }

  // NOTE: Legacy data trasformation for https://github.com/jeremyckahn/farmhand/issues/387
  if (sanitizedState.id) {
    sanitizedState.playerId = sanitizedState.id
    delete sanitizedState.id
  }

  return sanitizedState as farmhand.state
}

export const getPlayerName = memoize((playerId: string): string => {
  return funAnimalName(playerId)
})

export const getCostOfNextStorageExpansion = (
  currentInventoryLimit: number
): number => {
  const upgradesPurchased =
    (currentInventoryLimit - INITIAL_STORAGE_LIMIT) / STORAGE_EXPANSION_AMOUNT

  return (
    STORAGE_EXPANSION_BASE_PRICE +
    upgradesPurchased * STORAGE_EXPANSION_SCALE_PREMIUM
  )
}

/**
 * Create a no-op Promise that resolves in a specified amount of time.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * multiplier to be used for sales price adjustments based on completedAchievements
 */
export const getSalePriceMultiplier = (
  completedAchievements: Partial<Record<string, boolean>> = {}
): number => {
  let salePriceMultiplier = 1

  if (completedAchievements['i-am-rich-3']) {
    salePriceMultiplier += I_AM_RICH_BONUSES[2]
  } else if (completedAchievements['i-am-rich-2']) {
    salePriceMultiplier += I_AM_RICH_BONUSES[1]
  } else if (completedAchievements['i-am-rich-1']) {
    salePriceMultiplier += I_AM_RICH_BONUSES[0]
  }

  return salePriceMultiplier
}

const isPlotContentACrop = (
  plotContents: farmhand.plotContent
): plotContents is farmhand.crop =>
  getPlotContentType(plotContents) === itemType.CROP

/**
 * @param weightedOptions an array of objects each containing a `weight` property
 * @returns one of the items from weightedOptions
 */
export function randomChoice<T extends { weight: number }>(
  weightedOptions: T[]
): T {
  let totalWeight = 0
  const sortedOptions: T[] = []

  for (const option of weightedOptions) {
    totalWeight += option.weight
    sortedOptions.push(option)
  }

  sortedOptions.sort((a, b) => a.weight - b.weight)

  let diceRoll = random() * totalWeight
  let option: T | undefined
  let runningTotal = 0

  for (const i in sortedOptions) {
    option = sortedOptions[i]

    if (diceRoll < option.weight + runningTotal) {
      return option
    }

    runningTotal += option.weight
  }

  // Fallback to the last option if no match found
  return sortedOptions[sortedOptions.length - 1]
}

const colorizeCowTemplate = (() => {
  const cowImageWidth = 48
  const cowImageHeight = 48
  const cowImageFactoryCanvas = document.createElement('canvas')
  cowImageFactoryCanvas.setAttribute('height', String(cowImageHeight))
  cowImageFactoryCanvas.setAttribute('width', String(cowImageWidth))

  const cachedCowImages: Record<string, string> = {}

  // https://stackoverflow.com/a/5624139
  const hexToRgb = memoize((hex: string) => {
    const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      hex
    ) ?? ['', '0', '0', '0']

    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
    }
  })

  /**
   * @param cowTemplate Base64 representation of an image
   * @param color
   * @returns Base64 representation of an image
   */
  return async (cowTemplate: string, color: farmhand.cowColors) => {
    if (color === cowColors.RAINBOW) return animals.cow.rainbow

    const imageKey = `${color}_${cowTemplate}`

    if (cachedCowImages[imageKey]) return cachedCowImages[imageKey]

    try {
      // `data:image/png;base64,` needs to be removed from the base64 string
      // before being provided to Buffer.
      // https://github.com/oliver-moran/jimp/issues/231#issuecomment-282167737
      const cowTemplateBuffer = Buffer.from(
        cowTemplate.split(',')[1] ?? '',
        'base64'
      )
      const image = await Jimp.read(cowTemplateBuffer)

      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y) {
        const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y))

        // rgb(102, 102, 102) represents the color to replace in the template
        // source images (#666).
        if (r === 102 && g === 102 && b === 102) {
          const cowColorRgb = hexToRgb(COW_COLORS_HEX_MAP[color])
          const colorNumber = Jimp.rgbaToInt(
            cowColorRgb.r,
            cowColorRgb.g,
            cowColorRgb.b,
            255
          )

          image.setPixelColor(colorNumber, x, y)
        }
      })

      cachedCowImages[imageKey] = await image.getBase64Async(Jimp.MIME_PNG)

      return cachedCowImages[imageKey]
    } catch (e) {
      // Jimp.read() expectedly errors out when it receives an empty buffer,
      // which it will in some unit tests.
      if (import.meta.env?.MODE !== 'test') {
        console.error(e)
      }

      return pixel
    }
  }
})()

/**
 * @returns Base64 representation of an image
 */
export const getCowImage = async (cow: farmhand.cow): Promise<string> => {
  const cowIdNumber = convertStringToInteger(cow.id)
  const { variations } = animals.cow
  const cowTemplate = variations[cowIdNumber % variations.length]

  return await colorizeCowTemplate(cowTemplate, cow.color as farmhand.cowColors)
}

/**
 * Adapted from https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
 */
export const isInViewport = (element: Element): boolean => {
  const { top, left, bottom, right } = element.getBoundingClientRect()

  return (
    top >= 0 &&
    left >= 0 &&
    bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export const shouldPrecipitateToday = () => random() < PRECIPITATION_CHANCE
export const shouldStormToday = () => random() < STORM_CHANCE

export const isCowInBreedingPen = (
  cow: farmhand.cow,
  cowBreedingPen: farmhand.cowBreedingPen
): boolean =>
  cowBreedingPen.cowId1 === cow.id || cowBreedingPen.cowId2 === cow.id

export const isOctober = (): boolean => new Date().getMonth() === 9

export const isDecember = (): boolean => new Date().getMonth() === 11
