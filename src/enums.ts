/**
 * @property farmhand.module:enums.cropType
 * @enum
 */
export const cropType = {
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
  SUGARCANE: 'SUGARCANE',
  SWEET_POTATO: 'SWEET_POTATO',
  TOMATO: 'TOMATO',
  WATERMELON: 'WATERMELON',
  WHEAT: 'WHEAT',
  WEED: 'WEED',
} as const

export type cropType = typeof cropType[keyof typeof cropType]

/**
 * @property farmhand.module:enums.recipeType
 * @enum
 */
export const recipeType = {
  FERMENTATION: 'FERMENTATION',
  FORGE: 'FORGE',
  KITCHEN: 'KITCHEN',
  RECYCLING: 'RECYCLING',
  WINE: 'WINE',
  WOOD_CHIPPER: 'WOOD_CHIPPER',
} as const

export type recipeType = typeof recipeType[keyof typeof recipeType]

/**
 * @property farmhand.module:enums.fieldMode
 * @enum
 */
export const fieldMode = {
  CHOP: 'CHOP',
  CLEANUP: 'CLEANUP',
  FERTILIZE: 'FERTILIZE',
  HARVEST: 'HARVEST',
  HARVEST_FRUIT: 'HARVEST_FRUIT',
  MINE: 'MINE',
  OBSERVE: 'OBSERVE',
  PLANT: 'PLANT',
  SET_SPRINKLER: 'SET_SPRINKLER',
  SET_SCARECROW: 'SET_SCARECROW',
  SET_LIGHTNING_ROD: 'SET_LIGHTNING_ROD',
  WATER: 'WATER',
} as const

export type fieldMode = typeof fieldMode[keyof typeof fieldMode]

/**
 * @property farmhand.module:enums.stageFocusType
 * @enum
 */
export const stageFocusType = {
  NONE: 'NONE', // Used for testing
  HOME: 'HOME',
  FIELD: 'FIELD',
  FOREST: 'FOREST',
  SHOP: 'SHOP',
  COW_PEN: 'COW_PEN',
  INVENTORY: 'INVENTORY',
  WORKSHOP: 'WORKSHOP',
  CELLAR: 'CELLAR',
  FARMHAND_SHUFFLE: 'FARMHAND_SHUFFLE',
} as const

export type stageFocusType = typeof stageFocusType[keyof typeof stageFocusType]

/**
 * @property farmhand.module:enums.cropLifeStage
 * @enum
 */
export const cropLifeStage = {
  SEED: 'SEED',
  GROWING: 'GROWING',
  GROWN: 'GROWN',
} as const

export type cropLifeStage = typeof cropLifeStage[keyof typeof cropLifeStage]

/**
 * Tree-only extension of cropLifeStage. DEAD is deliberately not part of
 * cropLifeStage itself (shared by crop, fruit, and tree code) since only
 * trees can ever reach it.
 * @property farmhand.module:enums.treeLifeStage
 * @enum
 */
export const treeLifeStage = {
  ...cropLifeStage,
  DEAD: 'DEAD',
} as const

export type treeLifeStage = typeof treeLifeStage[keyof typeof treeLifeStage]

/**
 * @property farmhand.module:enums.itemType
 * @enum
 */
export const itemType = {
  COW_FEED: 'COW_FEED',
  CRAFTED_ITEM: 'CRAFTED_ITEM',
  CROP: 'CROP',
  FERTILIZER: 'FERTILIZER',
  FUEL: 'FUEL',
  HUGGING_MACHINE: 'HUGGING_MACHINE',
  LIGHTNING_ROD: 'LIGHTNING_ROD',
  MILK: 'MILK',
  MULCH: 'MULCH',
  ORE: 'ORE',
  SCARECROW: 'SCARECROW',
  SPRINKLER: 'SPRINKLER',
  STONE: 'STONE',
  TOOL_UPGRADE: 'TOOL_UPGRADE',
  TREE: 'TREE',
  WEED: 'WEED',
  WOOD: 'WOOD',
} as const

export type itemType = typeof itemType[keyof typeof itemType]

/**
 * @property farmhand.module:enums.treeType
 * @enum
 */
export const treeType = {
  APPLE: 'APPLE',
  BANANA: 'BANANA',
} as const

export type treeType = typeof treeType[keyof typeof treeType]

/**
 * @property farmhand.module:enums.fertilizerType
 * @enum
 */
export const fertilizerType = {
  NONE: 'NONE',
  STANDARD: 'STANDARD',
  RAINBOW: 'RAINBOW',
} as const

export type fertilizerType = typeof fertilizerType[keyof typeof fertilizerType]

/**
 * @property farmhand.module:enums.genders
 * @enum
 */
export const genders = {
  FEMALE: 'FEMALE',
  MALE: 'MALE',
} as const

export type genders = typeof genders[keyof typeof genders]

/**
 * @property farmhand.module:enums.cowColors
 * @enum
 */
export const cowColors = {
  BLUE: 'BLUE',
  BROWN: 'BROWN',
  GREEN: 'GREEN',
  ORANGE: 'ORANGE',
  PURPLE: 'PURPLE',
  RAINBOW: 'RAINBOW',
  WHITE: 'WHITE',
  YELLOW: 'YELLOW',
} as const

export type cowColors = typeof cowColors[keyof typeof cowColors]

const { RAINBOW, ...standardCowColors } = cowColors

export { standardCowColors }

/**
 * @property farmhand.module:enums.dialogView
 * @enum
 */
export const dialogView = {
  NONE: 'NONE',
  ACCOUNTING: 'ACCOUNTING',
  ACHIEVEMENTS: 'ACHIEVEMENTS',
  FARMERS_LOG: 'FARMERS_LOG',
  KEYBINDINGS: 'KEYBINDINGS',
  ONLINE_PEERS: 'ONLINE_PEERS',
  PRICE_EVENTS: 'PRICE_EVENTS',
  SETTINGS: 'SETTINGS',
  STATS: 'STATS',
} as const

export type dialogView = typeof dialogView[keyof typeof dialogView]

/**
 * @property farmhand.module:enums.toolType
 * @enum
 */
export const toolType = {
  AXE: 'AXE',
  PICKER_POLE: 'PICKER_POLE',
  SCYTHE: 'SCYTHE',
  SHOVEL: 'SHOVEL',
  HOE: 'HOE',
  WATERING_CAN: 'WATERING_CAN',
} as const

export type toolType = typeof toolType[keyof typeof toolType]

/**
 * @property farmhand.module:enums.toolLevel
 * @enum
 */
export const toolLevel = {
  UNAVAILABLE: 'UNAVAILABLE',
  DEFAULT: 'DEFAULT',
  BRONZE: 'BRONZE',
  IRON: 'IRON',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
} as const

export type toolLevel = typeof toolLevel[keyof typeof toolLevel]

/**
 * @property farmhand.module:enums.notificationSeverity
 * @enum
 */
export const notificationSeverity = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const

export type notificationSeverity = typeof notificationSeverity[keyof typeof notificationSeverity]

/**
 * @property farmhand.module:enums.cowTradeRejectionReason
 * @enum
 */
export const cowTradeRejectionReason = {
  REQUESTED_COW_UNAVAILABLE: 'REQUESTED_COW_UNAVAILABLE',
} as const

export type cowTradeRejectionReason = typeof cowTradeRejectionReason[keyof typeof cowTradeRejectionReason]

/**
 * @property farmhand.module:enums.cropFamily
 * @readonly
 * @enum
 */
export const cropFamily = {
  GRAPE: 'GRAPE',
} as const

export type cropFamily = typeof cropFamily[keyof typeof cropFamily]

/**
 * @property farmhand.module:enums.grapeVariety
 * @readonly
 * @enum
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
} as const

export type grapeVariety = typeof grapeVariety[keyof typeof grapeVariety]
