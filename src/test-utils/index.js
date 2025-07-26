import {
  dialogView,
  fertilizerType,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../enums.js'

export const shapeOf = object =>
  Object.keys(object).reduce((acc, key) => {
    acc[key] = typeof object[key]
    return acc
  }, {})

export const testCrop = (item = {}) => ({
  daysOld: 0,
  daysWatered: 0,
  fertilizerType: fertilizerType.NONE,
  itemId: 'sample-item-1',
  wasWateredToday: false,
  ...item,
})

export const testTree = (item = {}) => ({
  daysOld: 0,
  itemId: 'test-tree',
  ...item,
})

/**
 * @param {Partial<farmhand.shoveledPlot>} plotProps
 */
export const testShoveledPlot = plotProps => ({
  isShoveled: true,
  daysUntilClear: 5,
  ...plotProps,
})

export const testItem = (item = {}) => ({
  id: '',
  name: '',
  type: /** @type {farmhand.itemType} */ ('CRAFTED_ITEM'),
  value: 0,
  description: '',
  doesPriceFluctuate: false,
  isReplantable: false,
  quantity: 1,
  ...item,
})

/**
 * Creates a minimal but complete farmhand.recipe object for testing
 * @param {Partial<farmhand.recipe>} overrides - Properties to override in the test recipe
 * @returns {farmhand.recipe}
 */
export const testRecipe = (overrides = {}) => ({
  id: 'sample-recipe-1',
  name: 'Test Recipe',
  description: 'A test recipe',
  ingredients: {
    'sample-item-1': 1,
  },
  condition: () => true,
  recipeType: /** @type {farmhand.recipeType} */ ('KITCHEN'),
  type: /** @type {farmhand.itemType} */ ('CRAFTED_ITEM'),
  value: 100,
  ...overrides,
})

/**
 * Creates a minimal but complete farmhand.state object for testing
 * @param {Partial<farmhand.state>} overrides - Properties to override in the test state
 * @returns {farmhand.state}
 */
export const testState = (overrides = {}) => ({
  activePlayers: null,
  allowCustomPeerCowNames: false,
  cellarInventory: [],
  currentDialogView: dialogView.NONE,
  completedAchievements: {},
  cowForSale: {
    baseWeight: 1000,
    color: 'BROWN',
    colorsInBloodline: {
      BLUE: false,
      BROWN: true,
      GREEN: false,
      ORANGE: false,
      PURPLE: false,
      RAINBOW: false,
      WHITE: false,
      YELLOW: false,
    },
    daysOld: 1,
    daysSinceMilking: 0,
    daysSinceProducingFertilizer: 0,
    gender: 'FEMALE',
    happiness: 0.5,
    happinessBoostsToday: 0,
    id: 'test-cow',
    isBred: false,
    isUsingHuggingMachine: false,
    name: 'Test Cow',
    originalOwnerId: 'test-owner',
    ownerId: 'test-owner',
    timesTraded: 0,
    weightMultiplier: 1,
  },
  cowBreedingPen: {
    cowId1: null,
    cowId2: null,
    daysUntilBirth: -1,
  },
  cowColorsPurchased: {
    BLUE: 0,
    BROWN: 0,
    GREEN: 0,
    ORANGE: 0,
    PURPLE: 0,
    RAINBOW: 0,
    WHITE: 0,
    YELLOW: 0,
  },
  cowIdOfferedForTrade: '',
  cowInventory: [],
  cowsSold: {},
  cowsTraded: 0,
  cowTradeTimeoutId: null,
  cropsHarvested: {
    ASPARAGUS: 0,
    CARROT: 0,
    CORN: 0,
    GARLIC: 0,
    GRAPE: 0,
    JALAPENO: 0,
    OLIVE: 0,
    ONION: 0,
    PEA: 0,
    POTATO: 0,
    PUMPKIN: 0,
    SOYBEAN: 0,
    SPINACH: 0,
    STRAWBERRY: 0,
    SUNFLOWER: 0,
    SWEET_POTATO: 0,
    TOMATO: 0,
    WATERMELON: 0,
    WEED: 0,
    WHEAT: 0,
  },
  dayCount: 0,
  experience: 0,
  farmName: 'Test Farm',
  field: [[]],
  fieldMode: fieldMode.OBSERVE,
  forest: [[]],
  getCowAccept: null,
  getCowReject: null,
  getCowTradeRequest: null,
  getPeerMetadata: null,
  hasBooted: false,
  heartbeatTimeoutId: null,
  historicalDailyLosses: [],
  historicalDailyRevenue: [],
  historicalValueAdjustments: [],
  hoveredPlotRangeSize: 0,
  id: 'test-id',
  inventory: [],
  inventoryLimit: 50,
  isAwaitingCowTradeRequest: false,
  isAwaitingNetworkRequest: false,
  isCombineEnabled: false,
  isMenuOpen: false,
  itemsSold: {},
  cellarItemsSold: {},
  isChatOpen: false,
  isDialogViewOpen: false,
  isOnline: false,
  isWaitingForDayToCompleteIncrementing: false,
  learnedRecipes: {},
  loanBalance: 0,
  loansTakenOut: 0,
  money: 500,
  latestNotification: null,
  newDayNotifications: [],
  notificationLog: [],
  peers: {},
  peerRoom: null,
  pendingPeerMessages: [],
  latestPeerMessages: [],
  sendPeerMetadata: null,
  selectedCowId: '',
  selectedItemId: '',
  priceCrashes: {},
  priceSurges: {},
  profitabilityStreak: 0,
  record7dayProfitAverage: 0,
  recordProfitabilityStreak: 0,
  recordSingleDayProfit: 0,
  revenue: 0,
  redirect: '',
  room: 'test-room',
  sendCowAccept: null,
  sendCowReject: null,
  purchasedCombine: 0,
  purchasedComposter: 0,
  purchasedCowPen: 0,
  purchasedCellar: 0,
  purchasedField: 0,
  purchasedForest: 0,
  purchasedSmelter: 0,
  sendCowTradeRequest: null,
  showHomeScreen: true,
  showNotifications: true,
  stageFocus: stageFocusType.HOME,
  todaysNotifications: [],
  todaysLosses: 0,
  todaysPurchases: {},
  todaysRevenue: 0,
  todaysStartingInventory: {},
  toolLevels: {
    [toolType.HOE]: toolLevel.DEFAULT,
    [toolType.SCYTHE]: toolLevel.DEFAULT,
    [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
    [toolType.WATERING_CAN]: toolLevel.DEFAULT,
  },
  useAlternateEndDayButtonPosition: false,
  valueAdjustments: {},
  version: '1.0.0',
  ...overrides,
})
