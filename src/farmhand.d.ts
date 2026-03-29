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

  interface notificationLogEntry {
    day: number
    notifications: {
      error: string[]
      info: string[]
      success: string[]
      warning: string[]
    }
  }

  interface peerMessage {
    playerId: string
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
    playerId: string
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
    toolType?: toolType
    level?: toolLevel
    type: itemType
    value: number
    doesPriceFluctuate: boolean
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
    /** Keys are achievement ids. */
    completedAchievements: Partial<Record<string, boolean>>
    cowForSale: cow
    cowBreedingPen: cowBreedingPen
    cowInventory: cow[]
    /** Keys are color enums, values are the number of that color of cow purchased. */
    cowColorsPurchased: Partial<Record<cowColors, number>>
    /** The ID of the cow that is currently set to be traded with online peers. */
    cowIdOfferedForTrade: string
    /** Keys are items IDs, values are the id references of cow colors (rainbow-cow, etc.). */
    cowsSold: Partial<Record<string, number>>
    cowsTraded: number
    cowTradeTimeoutId?: number | null
    /** A map of totals of crops harvested. Keys are crop type IDs, values are the number of that crop harvested. */
    cropsHarvested: Partial<Record<cropType, number>>
    dayCount: number
    experience: number
    farmName: string
    field: (plotContent | null)[][]
    forest: (plantedTree | forestForageable | null)[][]
    fieldMode: fieldMode
    /** https://github.com/dmotz/trystero#receiver */
    getCowAccept?: Function | null
    /** https://github.com/dmotz/trystero#receiver */
    getCowReject?: Function | null
    /** https://github.com/dmotz/trystero#receiver */
    getCowTradeRequest?: Function | null
    /** https://github.com/dmotz/trystero#receiver */
    getPeerMetadata?: Function | null
    hasBooted: boolean
    heartbeatTimeoutId: number | null
    historicalDailyLosses: number[]
    historicalDailyRevenue: number[]
    /** Currently there is only one element in this array, but it will be used for more historical price data analysis in the future. It is an array for future-facing flexibility. */
    historicalValueAdjustments: Record<string, number>[]
    hoveredPlotRangeSize: number
    playerId: string
    inventory: { id: item['id']; quantity: number }[]
    /** Is -1 if inventory is unlimited. */
    inventoryLimit: number
    isAwaitingCowTradeRequest: boolean
    isAwaitingNetworkRequest: boolean
    isCombineEnabled: boolean
    isMenuOpen: boolean
    /** Keys are items IDs, values are the number of that item sold. The numbers in this map are inclusive of the corresponding ones in cellarItemsSold and represent the grand total of each item sold. */
    itemsSold: Partial<Record<item['id'], number>>
    /** Keys are items IDs, values are the number of that cellar item sold. The numbers in this map represent a subset of the corresponding ones in itemsSold. cellarItemsSold is intended to be used for internal bookkeeping. */
    cellarItemsSold: Partial<Record<item['id'], number>>
    /** Whether the chat modal is open. */
    isChatOpen: boolean
    isDialogViewOpen: boolean
    /** Whether the player is playing online. */
    isOnline: boolean
    isWaitingForDayToCompleteIncrementing: boolean
    /** Keys are recipe IDs, values are `true`. */
    learnedRecipes: Partial<Record<string, boolean>>
    loanBalance: number
    loansTakenOut: number
    money: number
    latestNotification?: notification | null
    newDayNotifications: notification[]
    notificationLog: notificationLogEntry[]
    /** Keys are (Trystero) peer ids, values are their respective metadata or null. */
    peers: Partial<Record<string, peerMetadata | null>>
    /** See https://github.com/dmotz/trystero */
    peerRoom?: any
    /** An array of messages to be sent to the Trystero peer room upon the next broadcast. */
    pendingPeerMessages: peerMessage[]
    /** An array of messages that have been received from peers. */
    latestPeerMessages: peerMessage[]
    /** See https://github.com/dmotz/trystero */
    sendPeerMetadata?: Function | null
    selectedCowId: string
    selectedItemId: string
    /** Keys are itemIds. */
    priceCrashes: Partial<Record<string, priceEvent>>
    /** Keys are itemIds. */
    priceSurges: Partial<Record<string, priceEvent>>
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
    /** The amount of money the player has generated in */
    revenue: number
    /** Transient value used to drive router redirection. */
    redirect: string
    /** What online room the player is in. */
    room: string
    /** https://github.com/dmotz/trystero#sender */
    sendCowAccept?: Function | null
    /** https://github.com/dmotz/trystero#sender */
    sendCowReject?: Function | null
    /** https://github.com/dmotz/trystero#sender */
    sendCowTradeRequest?: Function | null
    /** Option to show the Home Screen */
    showHomeScreen: boolean
    showNotifications: boolean
    /** indicating if the stage has been unlocked */
    stageFocus: stageFocusType
    todaysNotifications: notification[]
    /** Should always be a negative number. */
    todaysLosses: number
    /** Keys are item names, values are their respective quantities. */
    todaysPurchases: Partial<Record<string, number>>
    /** Should always be a positive number. */
    todaysRevenue: number
    /** Keys are item names, values are their respective quantities. */
    todaysStartingInventory: Partial<Record<item['id'], number>>
    toolLevels: Record<toolType, toolLevel>
    /** Option to display the Bed button on the left side of the screen. */
    useAlternateEndDayButtonPosition: boolean
    valueAdjustments: Record<string, number>
    /** Comes from the `version` property in package.json. */
    version: string
  }
}
