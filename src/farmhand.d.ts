declare namespace farmhand {
  // Enums from src/enums.js
  type cropType =
    | 'ASPARAGUS'
    | 'CARROT'
    | 'CORN'
    | 'GARLIC'
    | 'GRAPE'
    | 'JALAPENO'
    | 'OLIVE'
    | 'ONION'
    | 'PEA'
    | 'POTATO'
    | 'PUMPKIN'
    | 'SOYBEAN'
    | 'SPINACH'
    | 'SUNFLOWER'
    | 'STRAWBERRY'
    | 'SWEET_POTATO'
    | 'TOMATO'
    | 'WATERMELON'
    | 'WHEAT'
    | 'WEED'
  type recipeType = 'FERMENTATION' | 'FORGE' | 'KITCHEN' | 'RECYCLING' | 'WINE'
  type fieldMode =
    | 'CLEANUP'
    | 'FERTILIZE'
    | 'HARVEST'
    | 'MINE'
    | 'OBSERVE'
    | 'PLANT'
    | 'SET_SPRINKLER'
    | 'SET_SCARECROW'
    | 'WATER'
  type stageFocusType =
    | 'NONE'
    | 'HOME'
    | 'FIELD'
    | 'FOREST'
    | 'SHOP'
    | 'COW_PEN'
    | 'INVENTORY'
    | 'WORKSHOP'
    | 'CELLAR'
  type cropLifeStage = 'SEED' | 'GROWING' | 'GROWN'
  type itemType =
    | 'COW_FEED'
    | 'CRAFTED_ITEM'
    | 'CROP'
    | 'FERTILIZER'
    | 'FUEL'
    | 'HUGGING_MACHINE'
    | 'MILK'
    | 'ORE'
    | 'SCARECROW'
    | 'SPRINKLER'
    | 'STONE'
    | 'TOOL_UPGRADE'
    | 'WEED'
  type fertilizerType = 'NONE' | 'STANDARD' | 'RAINBOW'
  type genders = 'FEMALE' | 'MALE'
  type cowColors =
    | 'BLUE'
    | 'BROWN'
    | 'GREEN'
    | 'ORANGE'
    | 'PURPLE'
    | 'RAINBOW'
    | 'WHITE'
    | 'YELLOW'
  type dialogView =
    | 'NONE'
    | 'ACCOUNTING'
    | 'ACHIEVEMENTS'
    | 'FARMERS_LOG'
    | 'KEYBINDINGS'
    | 'ONLINE_PEERS'
    | 'PRICE_EVENTS'
    | 'SETTINGS'
    | 'STATS'
  type toolType = 'SCYTHE' | 'SHOVEL' | 'HOE' | 'WATERING_CAN'
  type toolLevel =
    | 'UNAVAILABLE'
    | 'DEFAULT'
    | 'BRONZE'
    | 'IRON'
    | 'SILVER'
    | 'GOLD'
  type cowTradeRejectionReason = 'REQUESTED_COW_UNAVAILABLE'
  type cropFamily = 'GRAPE'
  type grapeVariety =
    | 'CHARDONNAY'
    | 'SAUVIGNON_BLANC'
    | 'CABERNET_SAUVIGNON'
    | 'TEMPRANILLO'
    | 'NEBBIOLO'

  type notificationSeverity = 'error' | 'info' | 'success' | 'warning'

  // Interfaces from src/index.js and src/components/Farmhand/Farmhand.js
  interface item {
    id: string
    name: string
    type: itemType
    value: number
    cropTimeline?: number[]
    cropType?: cropType
    description?: string
    enablesFieldMode?: string
    growsInto?: string | string[]
    doesPriceFluctuate?: boolean
    hoveredPlotRange?: number
    isPlantableCrop?: boolean
    isReplantable?: boolean
    quantity?: number
    tier?: number
    spawnChance?: number | null
    daysToFerment?: number | null
    isSeed?: boolean
    cropLifecycleDuration?: number
  }

  interface seedItem extends item {
    growsInto: string
  }

  interface cropVariety extends item {
    imageId: string
    cropFamily: cropFamily
    variety: grapeVariety
  }

  interface grape extends cropVariety {
    cropFamily: 'GRAPE'
    variety: grapeVariety
    wineId: string
  }

  interface wine extends recipe {
    variety: grapeVariety
  }

  interface plotContent {
    itemId: string
    isFertilized?: boolean
    fertilizerType: fertilizerType
    daysOld?: number
    daysWatered?: number
    wasWateredToday?: boolean
    isShoveled?: boolean
    daysUntilClear?: number
    oreId?: string | null
  }

  interface crop extends plotContent {}

  interface plantedTree {
    daysOld: number
    itemId: string
  }

  interface forestForageable {
    daysOld: number
    forageableId: 'mushroom' | 'acorn'
  }

  interface shoveledPlot {
    isShoveled: boolean
    daysUntilClear: number
    oreId?: string | null
  }

  interface cow {
    baseWeight: number
    color: string
    colorsInBloodline: Record<cowColors, boolean>
    daysOld: number
    daysSinceMilking: number
    daysSinceProducingFertilizer: number
    gender: genders
    happiness: number
    happinessBoostsToday: number
    id: string
    isBred: boolean
    isUsingHuggingMachine: boolean
    name: string
    originalOwnerId: string
    ownerId: string
    timesTraded: number
    weightMultiplier: number
  }

  interface cowBreedingPen {
    cowId1?: string | null
    cowId2?: string | null
    daysUntilBirth: number
  }

  type recipeCondition = (state: state) => boolean

  interface recipe extends item {
    recipeType: recipeType
    ingredients: Record<string, number>
    condition: recipeCondition
  }

  interface keg {
    id: string
    itemId: string
    daysUntilMature: number
  }

  interface priceEvent {
    itemId: string
    daysRemaining: number
  }

  type achievementCondition = (state: state, prevState: state) => boolean
  type achievementReward = (state: state) => state

  interface achievement {
    id: string
    name: string
    description: string
    rewardDescription: string
    condition: achievementCondition
    reward: achievementReward
  }

  interface level {
    id: number
    increasesSprinklerRange?: boolean
    unlocksShopItem?: string
  }

  interface notification {
    severity: notificationSeverity
    onClick?: Function
    message: string
  }

  interface peerMessage {
    id: string
    severity: notificationSeverity
    message: string
  }

  interface offeredCow extends cow {
    ownerId: string
  }

  interface peerMetadata {
    cowsSold: Record<string, number>
    cropsHarvested: Record<string, number>
    dayCount: number
    experience: number
    id: string
    money: number
    pendingPeerMessages: peerMessage[]
    version: string
    cowOfferedForTrade?: offeredCow
  }

  interface upgradesMetadatum {
    id: string
    description?: string
    name: string
    ingredients?: Record<item['id'], number>
    nextLevel?: toolLevel
    isMaxLevel?: boolean
  }

  interface upgradesMetadata {
    [key in toolType]?: Record<toolLevel, upgradesMetadatum>
  }

  interface levelEntitlements {
    sprinklerRange: number
    items: Record<string, boolean>
    tools: Record<string, boolean>
    stageFocusType: Record<string, boolean>
  }

  interface purchaseableFieldSize {
    columns: number
    rows: number
    price: number
  }

  interface Factory {
    generate(): item | item[] | null
  }

  interface state {
    activePlayers?: number | null
    allowCustomPeerCowNames: boolean
    cellarInventory: keg[]
    currentDialogView: dialogView
    completedAchievements: Record<string, boolean>
    cowForSale: cow
    cowBreedingPen: cowBreedingPen
    cowInventory: cow[]
    cowColorsPurchased: Record<cowColors, number>
    cowIdOfferedForTrade: string
    cowsSold: Record<string, number>
    cowsTraded: number
    cowTradeTimeoutId?: number | null
    cropsHarvested: Record<cropType, number>
    dayCount: number
    experience: number
    farmName: string
    field: (plotContent | null)[][]
    forest: (plantedTree | forestForageable | null)[][]
    fieldMode: fieldMode
    getCowAccept?: Function | null
    getCowReject?: Function | null
    getCowTradeRequest?: Function | null
    getPeerMetadata?: Function | null
    hasBooted: boolean
    heartbeatTimeoutId: number | null
    historicalDailyLosses: number[]
    historicalDailyRevenue: number[]
    historicalValueAdjustments: Record<string, number>[]
    hoveredPlotRangeSize: number
    id: string
    inventory: { id: item['id']; quantity: number }[]
    inventoryLimit: number
    isAwaitingCowTradeRequest: boolean
    isAwaitingNetworkRequest: boolean
    isCombineEnabled: boolean
    isMenuOpen: boolean
    itemsSold: Record<item['id'], number>
    cellarItemsSold: Record<item['id'], number>
    isChatOpen: boolean
    isDialogViewOpen: boolean
    isOnline: boolean
    isWaitingForDayToCompleteIncrementing: boolean
    learnedRecipes: Record<string, boolean>
    loanBalance: number
    loansTakenOut: number
    money: number
    latestNotification?: notification | null
    newDayNotifications: notification[]
    notificationLog: notification[]
    peers: Record<string, peerMetadata | null>
    peerRoom?: any
    pendingPeerMessages: peerMessage[]
    latestPeerMessages: peerMessage[]
    sendPeerMetadata?: Function | null
    selectedCowId: string
    selectedItemId: string
    priceCrashes: Record<string, priceEvent>
    priceSurges: Record<string, priceEvent>
    purchasedCombine: number
    purchasedComposter: number
    purchasedCowPen: number
    purchasedCellar: number
    purchasedField: number
    purchasedForest: number
    purchasedSmelter: number
    profitabilityStreak: number
    record7dayProfitAverage: number
    recordProfitabilityStreak: number
    recordSingleDayProfit: number
    revenue: number
    redirect: string
    room: string
    sendCowAccept?: Function | null
    sendCowReject?: Function | null
    sendCowTradeRequest?: Function | null
    showHomeScreen: boolean
    showNotifications: boolean
    stageFocus: stageFocusType
    todaysNotifications: notification[]
    todaysLosses: number
    todaysPurchases: Record<string, number>
    todaysRevenue: number
    todaysStartingInventory: Record<item['id'], number>
    toolLevels: Record<toolType, toolLevel>
    useAlternateEndDayButtonPosition: boolean
    valueAdjustments: Record<string, number>
    version: string
  }
}
