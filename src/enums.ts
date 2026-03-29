/**
 * @module farmhand.enums
 * @ignore
 */

/**
 * @property farmhand.module:enums.cropType
 * @enum {string}
 */
export const cropType = /** @type {const} */ ({
  ASPARAGUS: 'ASPARAGUS',
  CARROT: 'CARROT',
  CORN: 'CORN',
  GARLIC: 'GARLIC',
  GRAPE: 'GRAPE',
  JALAPENO: 'JALAPENO',
  OLIVE: 'OLIVE',
  ONION: 'ONION',
  PEA: 'PEA',
  POTATO: 'POTATO',
  PUMPKIN: 'PUMPKIN',
  SOYBEAN: 'SOYBEAN',
  SPINACH: 'SPINACH',
  SUNFLOWER: 'SUNFLOWER',
  STRAWBERRY: 'STRAWBERRY',
  SWEET_POTATO: 'SWEET_POTATO',
  TOMATO: 'TOMATO',
  WATERMELON: 'WATERMELON',
  WHEAT: 'WHEAT',
  WEED: 'WEED',
})

/**
 * @property farmhand.module:enums.recipeType
 * @enum {string}
 */
export const recipeType = /** @type {const} */ ({
  FERMENTATION: 'FERMENTATION',
  FORGE: 'FORGE',
  KITCHEN: 'KITCHEN',
  RECYCLING: 'RECYCLING',
  WINE: 'WINE',
})

/**
 * @property farmhand.module:enums.fieldMode
 * @enum {string}
 */
export const fieldMode = /** @type {const} */ ({
  CLEANUP: 'CLEANUP',
  FERTILIZE: 'FERTILIZE',
  HARVEST: 'HARVEST',
  MINE: 'MINE',
  OBSERVE: 'OBSERVE',
  PLANT: 'PLANT',
  SET_SPRINKLER: 'SET_SPRINKLER',
  SET_SCARECROW: 'SET_SCARECROW',
  WATER: 'WATER',
})

/**
 * @property farmhand.module:enums.stageFocusType
 * @enum {string}
 */
export const stageFocusType = /** @type {const} */ ({
  NONE: 'NONE', // Used for testing
  HOME: 'HOME',
  FIELD: 'FIELD',
  FOREST: 'FOREST',
  SHOP: 'SHOP',
  COW_PEN: 'COW_PEN',
  INVENTORY: 'INVENTORY',
  WORKSHOP: 'WORKSHOP',
  CELLAR: 'CELLAR',
})

/**
 * @property farmhand.module:enums.cropLifeStage
 * @enum {string}
 */
export const cropLifeStage = /** @type {const} */ ({
  SEED: 'SEED',
  GROWING: 'GROWING',
  GROWN: 'GROWN',
})

/**
 * @property farmhand.module:enums.itemType
 * @enum {string}
 */
export const itemType = /** @type {const} */ ({
  COW_FEED: 'COW_FEED',
  CRAFTED_ITEM: 'CRAFTED_ITEM',
  CROP: 'CROP',
  FERTILIZER: 'FERTILIZER',
  FUEL: 'FUEL',
  HUGGING_MACHINE: 'HUGGING_MACHINE',
  MILK: 'MILK',
  ORE: 'ORE',
  SCARECROW: 'SCARECROW',
  SPRINKLER: 'SPRINKLER',
  STONE: 'STONE',
  TOOL_UPGRADE: 'TOOL_UPGRADE',
  WEED: 'WEED',
})

/**
 * @property farmhand.module:enums.fertilizerType
 * @enum {string}
 */
export const fertilizerType = /** @type {const} */ ({
  NONE: 'NONE',
  STANDARD: 'STANDARD',
  RAINBOW: 'RAINBOW',
})

/**
 * @property farmhand.module:enums.genders
 * @enum {string}
 */
export const genders = /** @type {const} */ ({
  FEMALE: 'FEMALE',
  MALE: 'MALE',
})

/**
 * @property farmhand.module:enums.cowColors
 * @enum {string}
 */
export const cowColors = /** @type {const} */ ({
  BLUE: 'BLUE',
  BROWN: 'BROWN',
  GREEN: 'GREEN',
  ORANGE: 'ORANGE',
  PURPLE: 'PURPLE',
  RAINBOW: 'RAINBOW',
  WHITE: 'WHITE',
  YELLOW: 'YELLOW',
})

const { RAINBOW, ...standardCowColors } = cowColors
export { standardCowColors }

/**
 * @property farmhand.module:enums.dialogView
 * @enum {string}
 */
export const dialogView = /** @type {const} */ ({
  NONE: 'NONE',
  ACCOUNTING: 'ACCOUNTING',
  ACHIEVEMENTS: 'ACHIEVEMENTS',
  FARMERS_LOG: 'FARMERS_LOG',
  KEYBINDINGS: 'KEYBINDINGS',
  ONLINE_PEERS: 'ONLINE_PEERS',
  PRICE_EVENTS: 'PRICE_EVENTS',
  SETTINGS: 'SETTINGS',
  STATS: 'STATS',
})

/**
 * @property farmhand.module:enums.toolType
 * @enum {string}
 */
export const toolType = /** @type {const} */ ({
  SCYTHE: 'SCYTHE',
  SHOVEL: 'SHOVEL',
  HOE: 'HOE',
  WATERING_CAN: 'WATERING_CAN',
})

/**
 * @property farmhand.module:enums.toolLevel
 * @enum {string}
 */
export const toolLevel = /** @type {const} */ ({
  UNAVAILABLE: 'UNAVAILABLE',
  DEFAULT: 'DEFAULT',
  BRONZE: 'BRONZE',
  IRON: 'IRON',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
})

/**
 * @property farmhand.module:enums.notificationSeverity
 * @enum {string}
 */
export const notificationSeverity = /** @type {const} */ ({
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
})

/**
 * @property farmhand.module:enums.cowTradeRejectionReason
 * @enum {string}
 */
export const cowTradeRejectionReason = /** @type {const} */ ({
  REQUESTED_COW_UNAVAILABLE: 'REQUESTED_COW_UNAVAILABLE',
})

/**
 * @property farmhand.module:enums.cropFamily
 * @readonly
 * @enum {string}
 */
export const cropFamily = {
  GRAPE: 'GRAPE',
}

/**
 * @property farmhand.module:enums.grapeVariety
 * @readonly
 * @enum {string}
 */
export const grapeVariety = {
  CHARDONNAY: 'CHARDONNAY',
  SAUVIGNON_BLANC: 'SAUVIGNON_BLANC',
  //PINOT_BLANC: 'PINOT_BLANC',
  //MUSCAT: 'MUSCAT',
  //RIESLING: 'RIESLING',
  //MERLOT: 'MERLOT',
  CABERNET_SAUVIGNON: 'CABERNET_SAUVIGNON',
  //SYRAH: 'SYRAH',
  TEMPRANILLO: 'TEMPRANILLO',
  NEBBIOLO: 'NEBBIOLO',
}
