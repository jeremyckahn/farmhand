/**
 * @module farmhand.constants
 * @ignore
 */

import { fieldMode, stageFocusType } from './enums'

const { freeze } = Object

export const MEMOIZE_CACHE_CLEAR_THRESHOLD = 10

// This MUST be kept in sync with the $break- variables in variables.sass.
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920,
}

export const STANDARD_LOAN_AMOUNT = 500

export const LOAN_GARNISHMENT_RATE = 0.05
export const LOAN_INTEREST_RATE = 0.02

export const FERTILIZER_BONUS = 0.5

export const INITIAL_STORAGE_LIMIT = 100
export const STORAGE_EXPANSION_AMOUNT = 100
export const STORAGE_EXPANSION_BASE_PRICE = 500
export const STORAGE_EXPANSION_SCALE_PREMIUM = 50

export const INITIAL_FIELD_WIDTH = 6
export const INITIAL_FIELD_HEIGHT = 10

export const PURCHASEABLE_FIELD_SIZES = freeze(
  new Map([
    [1, { columns: 8, rows: 12, price: 1_000 }],
    [2, { columns: 10, rows: 16, price: 2_000 }],
    [3, { columns: 12, rows: 18, price: 3_000 }],
  ])
)

export const PURCHASEABLE_COMBINES = freeze(
  new Map([[1, { type: 'Basic', price: 500_000 }]])
)

export const PURCHASEABLE_SMELTERS = freeze(
  new Map([[1, { type: 'Basic', price: 15_000 }]])
)

export const PURCHASEABLE_COW_PENS = freeze(
  new Map([
    [1, { cows: 10, price: 1500 }],
    [2, { cows: 20, price: 2500 }],
    [3, { cows: 30, price: 3500 }],
  ])
)

// Buff/nerf chances
export const CROW_CHANCE = 0.1
export const PRECIPITATION_CHANCE = 0.1
export const STORM_CHANCE = 0.5

export const SCARECROW_ITEM_ID = 'scarecrow'
export const SPRINKLER_ITEM_ID = 'sprinkler'
export const INITIAL_SPRINKLER_RANGE = 1

export const COW_STARTING_WEIGHT_BASE = 1800
export const COW_STARTING_WEIGHT_VARIANCE = 200

export const MAX_ANIMAL_NAME_LENGTH = 30

export const MALE_COW_WEIGHT_MULTIPLIER = 1.1

export const COW_HUG_BENEFIT = 0.05
export const MAX_DAILY_COW_HUG_BENEFITS = 3

export const COW_WEIGHT_MULTIPLIER_FEED_BENEFIT = 0.1
export const COW_WEIGHT_MULTIPLIER_MINIMUM = 0.5
export const COW_WEIGHT_MULTIPLIER_MAXIMUM = 1.5

export const COW_MILK_RATE_SLOWEST = 7
export const COW_MILK_RATE_FASTEST = 2

export const COW_FERTILIZER_PRODUCTION_RATE_SLOWEST = 7
export const COW_FERTILIZER_PRODUCTION_RATE_FASTEST = 1

export const COW_FEED_ITEM_ID = 'cow-feed'
export const HUGGING_MACHINE_ITEM_ID = 'hugging-machine'

export const COW_MAXIMUM_VALUE_MATURITY_AGE = 100
export const COW_MINIMUM_VALUE_MULTIPLIER = 0
export const COW_MAXIMUM_VALUE_MULTIPLIER = 1

export const COW_GESTATION_PERIOD_DAYS = 3
export const COW_MINIMUM_HAPPINESS_TO_BREED = 0.8

export const NOTIFICATION_DURATION = 6000
export const NOTIFICATION_LOG_SIZE = 14

export const PRICE_EVENT_CHANCE = 0.2
export const PRICE_EVENT_STANDARD_DURATION_DECREASE = 1

export const STAGE_TITLE_MAP = {
  [stageFocusType.HOME]: 'Home',
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.SHOP]: 'Shop',
  [stageFocusType.COW_PEN]: 'Cows',
  [stageFocusType.WORKSHOP]: 'Workshop',
}

export const DAILY_FINANCIAL_HISTORY_RECORD_LENGTH = 7

export const RECIPE_INGREDIENT_VALUE_MULTIPLIER = 1.25

export const I_AM_RICH_BONUSES = [0.05, 0.1, 0.25]

export const PERSISTED_STATE_KEYS = [
  'completedAchievements',
  'cowBreedingPen',
  'cowColorsPurchased',
  'cowForSale',
  'cowInventory',
  'cowsSold',
  'cropsHarvested',
  'dayCount',
  'farmName',
  'field',
  'historicalDailyLosses',
  'historicalDailyRevenue',
  'historicalValueAdjustments',
  'hoveredPlotRangeSize',
  'id',
  'inventory',
  'inventoryLimit',
  'isCombineEnabled',
  'itemsSold',
  'learnedRecipes',
  'loanBalance',
  'loansTakenOut',
  'money',
  'newDayNotifications',
  'notificationLog',
  'priceCrashes',
  'priceSurges',
  'profitabilityStreak',
  'purchasedCombine',
  'purchasedCowPen',
  'purchasedField',
  'record7dayProfitAverage',
  'recordProfitabilityStreak',
  'recordSingleDayProfit',
  'revenue',
  'showNotifications',
  'todaysLosses',
  'todaysPurchases',
  'todaysRevenue',
  'todaysStartingInventory',
  'useAlternateEndDayButtonPosition',
  'valueAdjustments',
  'version',
]

export const PEER_METADATA_STATE_KEYS = [
  'cowsSold',
  'cropsHarvested',
  'dayCount',
  'id',
  'itemsSold',
  'money',
  'pendingPeerMessages',
  'version',
]

export const DEFAULT_ROOM = 'global'

export const MAX_PENDING_PEER_MESSAGES = 5
export const MAX_LATEST_PEER_MESSAGES = 30

export const LEFT = 'left'
export const RIGHT = 'right'

export const TOOLBELT_FIELD_MODES = new Set([
  fieldMode.CLEANUP,
  fieldMode.HARVEST,
  fieldMode.WATER,
  fieldMode.MINE,
])

/* resource spawning constants to control randomness */

// should a resource attempt to spawn when plot is mined?
export const RESOURCE_SPAWN_CHANCE = 0.5

// if a resource is going to spawn, which kind?
export const ORE_SPAWN_CHANCE = 0.3
export const COAL_SPAWN_CHANCE = 0.4
export const COAL_WITH_STONE_SPAWN_CHANCE = 0.4
export const STONE_SPAWN_CHANCE = 0.5

// if spawning ore, which kind?
export const BRONZE_SPAWN_CHANCE = 0.6
export const GOLD_SPAWN_CHANCE = 0.2
export const IRON_SPAWN_CHANCE = 0.4
export const SILVER_SPAWN_CHANCE = 0.3

/* end of resource spawning constants */
