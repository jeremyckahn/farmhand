import { stageFocusType } from './enums'

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
export const FERTILIZER_ITEM_ID = 'fertilizer'

export const INITIAL_INVENTORY_LIMIT = 100

export const INITIAL_FIELD_WIDTH = 6
export const INITIAL_FIELD_HEIGHT = 10

export const PURCHASEABLE_FIELD_SIZES = freeze(
  new Map([
    [1, { columns: 8, rows: 12, price: 1000 }],
    [2, { columns: 10, rows: 16, price: 2000 }],
    [3, { columns: 12, rows: 18, price: 3000 }],
  ])
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
export const SPRINKLER_RANGE = 1

export const COW_STARTING_WEIGHT_BASE = 1800
export const COW_STARTING_WEIGHT_VARIANCE = 200

export const MAX_ANIMAL_NAME_LENGTH = 30

export const MALE_COW_WEIGHT_MULTIPLIER = 1.1

export const COW_HUG_BENEFIT = 0.05
export const MAX_DAILY_COW_HUG_BENEFITS = 3

export const COW_WEIGHT_MULTIPLIER_FEED_BENEFIT = 0.1
export const COW_WEIGHT_MULTIPLIER_MINIMUM = 0.5
export const COW_WEIGHT_MULTIPLIER_MAXIMUM = 1.5

export const COW_MILK_RATE_SLOWEST = 5
export const COW_MILK_RATE_FASTEST = 0

export const COW_FEED_ITEM_ID = 'cow-feed'
export const HUGGING_MACHINE_ITEM_ID = 'hugging-machine'

export const COW_MAXIMUM_AGE_VALUE_DROPOFF = 100
export const COW_MINIMUM_VALUE_MULTIPLIER = 0.5
export const COW_MAXIMUM_VALUE_MULTIPLIER = 1.5

export const NOTIFICATION_DURATION = 6000
export const NOTIFICATION_LOG_SIZE = 14

export const PRICE_EVENT_CHANCE = 0.2
export const PRICE_EVENT_STANDARD_DURATION_DECREASE = 1

export const STAGE_TITLE_MAP = {
  [stageFocusType.HOME]: 'Home',
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.SHOP]: 'Shop',
  [stageFocusType.COW_PEN]: 'Cows',
  [stageFocusType.KITCHEN]: 'Kitchen',
}

// The number here is somewhat arbitrary and tuned to the UX and rounding
// behavior of react-zoom-pan-pinch.
export const FIELD_ZOOM_SCALE_DISABLE_SWIPE_THRESHOLD = 1.1

export const STORAGE_EXPANSION_AMOUNT = 100
export const STORAGE_EXPANSION_PRICE = 500
