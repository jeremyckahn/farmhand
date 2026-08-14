declare module '*?dataUri' {
  const content: string

  export default content
}

declare module 'seedrandom'
declare module 'global/window.js'
declare module 'file-saver'
declare module 'react-helmet'
declare module 'lodash.debounce'
declare module 'lodash.throttle'
declare module 'react-router-dom'
declare module 'react-file-reader-input'
declare module 'process/browser'
declare module 'redis'

declare namespace JSX {
  interface IntrinsicElements {
    'chat-room': any
  }
}

declare namespace farmhand {
  // Interfaces from src/index.js and src/components/Farmhand/Farmhand.js
  interface item {
    id: string
    name: string
    type: import('./enums.js').itemType
    value: number
    cropTimeline?: number[]
    cropType?: import('./enums.js').cropType
    description?: string
    enablesFieldMode?: string
    growsInto?: string | string[]
    doesPriceFluctuate?: boolean
    hoveredPlotRange?: number
    isPlantableCrop?: boolean
    isPlantableTree?: boolean
    isReplantable?: boolean
    quantity?: number
    tier?: number
    spawnChance?: number | null
    daysToFerment?: number | null
    isSeed?: boolean
    cropLifecycleDuration?: number
    treeTimeline?: number[]
    fruitTimeline?: number[]
    treeType?: import('./enums.js').treeType
    // How many days a tree stays GROWN before dying (becoming DEAD) - see
    // getTreeLifeStage.ts. Undefined means the tree never dies.
    lifespan?: number
    // How many lightning strikes a placed Lightning Rod can sustain before
    // being destroyed - see plotContent.lightningStrikesSustained and
    // applyPrecipitation.ts.
    lightningStrikeCapacity?: number
    // What gets added back to inventory when a placed instance of this item
    // is destroyed/scrapped. Generic - not specific to Lightning Rods or to
    // ore - see applyDestructionYield in reducers/helpers.tsx for the
    // shared logic that applies it.
    destructionYield?: { itemId: string; quantity: number }
  }

  interface seedItem extends item {
    growsInto: string
  }

  interface cropVariety extends item {
    imageId: string
    cropFamily: import('./enums.js').cropFamily
    variety: import('./enums.js').grapeVariety
  }

  interface grape extends cropVariety {
    cropFamily: 'GRAPE'
    variety: import('./enums.js').grapeVariety
    wineId: string
  }

  interface wine extends recipe {
    variety: import('./enums.js').grapeVariety
  }

  interface plotContent {
    itemId: string
    fertilizerType: import('./enums.js').fertilizerType
    daysOld?: number
    daysWatered?: number
    wasWateredToday?: boolean
    isShoveled?: boolean
    daysUntilClear?: number
    oreId?: string | null
    // How many lightning strikes this specific placed Lightning Rod has
    // sustained so far - see item.lightningStrikeCapacity and
    // applyPrecipitation.ts. Lives on the plot (not inventory) since a
    // rod is a non-removable fixture once placed.
    lightningStrikesSustained?: number
  }

  interface crop extends plotContent {}

  interface plantedTree {
    daysOld: number
    daysSinceLastHarvest: number
    itemId: string
    // This tree instance's own randomized lifespan (see
    // getRandomizedLifespan.ts), rolled once at plant time. Overrides
    // item.lifespan for this specific tree when present; undefined means
    // it falls back to item.lifespan (e.g. saves from before this field
    // existed).
    lifespan?: number
    fertilizerType?: import('./enums.js').fertilizerType
    // Growth progress, separate from daysOld - mirrors how crops track
    // daysWatered separately from their own daysOld. Fertilizer
    // accelerates this counter without touching daysOld (see
    // processForest.ts).
    daysGrown?: number
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
    color: import('./enums.js').cowColors
    colorsInBloodline: Partial<Record<import('./enums.js').cowColors, boolean>>
    daysOld: number
    daysSinceMilking: number
    daysSinceProducingFertilizer: number
    gender: import('./enums.js').genders
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
    recipeType: import('./enums.js').recipeType
    ingredients: Record<string, number>
    condition: recipeCondition
    isPie?: boolean
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

  type achievementCondition = (state: state, prevState?: state) => boolean
  type achievementReward = (state: state) => state
  type achievementProgress = (
    state: state
  ) => {
    currentValue: number
    goal: number
  }

  interface achievement {
    id: string
    name: string
    description: string
    rewardDescription: string
    condition: achievementCondition
    reward: achievementReward
    getProgress?: achievementProgress
  }

  interface level {
    id: number
    increasesSprinklerRange?: boolean
    unlocksShopItem?: string
  }

  interface notification {
    severity: import('./enums.js').notificationSeverity
    onClick?: (...args: any[]) => any
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
    severity: import('./enums.js').notificationSeverity
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
    nextLevel?: import('./enums.js').toolLevel
    isMaxLevel?: boolean
    toolType?: import('./enums.js').toolType
    level?: import('./enums.js').toolLevel
    type: import('./enums.js').itemType
    value: number
    doesPriceFluctuate: boolean
  }

  type upgradesMetadata = {
    [key in import('./enums.js').toolType]?: Record<
      import('./enums.js').toolLevel,
      upgradesMetadatum
    >
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
    currentDialogView: import('./enums.js').dialogView
    /**
     * Keys are achievement ids.
     */
    completedAchievements: Partial<Record<string, boolean>>
    cowForSale: cow
    cowBreedingPen: cowBreedingPen
    cowInventory: cow[]
    /**
     * Keys are color enums, values are the number of that color of cow purchased.
     */
    cowColorsPurchased: Partial<Record<import('./enums.js').cowColors, number>>
    /**
     * The ID of the cow that is currently set to be traded with online peers.
     */
    cowIdOfferedForTrade: string
    /**
     * Keys are items IDs, values are the id references of cow colors (rainbow-cow, etc.).
     */
    cowsSold: Partial<Record<string, number>>
    cowsTraded: number
    cowTradeTimeoutId?: number | null
    /**
     * A map of totals of crops harvested. Keys are crop type IDs, values are the number of that crop harvested.
     */
    cropsHarvested: Partial<Record<import('./enums.js').cropType, number>>
    dayCount: number
    experience: number
    farmName: string
    field: (plotContent | null)[][]
    forest: (plantedTree | forestForageable | null)[][]
    /**
     * Total number of trees chopped down in the Forest.
     */
    treesChopped: number
    /**
     * A map of totals of fruit picked from Forest trees. Keys are item IDs,
     * values are the number of that fruit picked.
     */
    treeFruitsHarvested: Partial<Record<item['id'], number>>
    /**
     * A map of totals of mulch applied to Forest trees. Keys are mulch item
     * IDs, values are the number of times that mulch type has been applied.
     */
    mulchApplied: Partial<Record<item['id'], number>>
    fieldMode: import('./enums.js').fieldMode
    /**
     * https://github.com/dmotz/trystero#receiver
     */
    getCowAccept?: Function | null
    /**
     * https://github.com/dmotz/trystero#receiver
     */
    getCowReject?: Function | null
    /**
     * https://github.com/dmotz/trystero#receiver
     */
    getCowTradeRequest?: Function | null
    /**
     * https://github.com/dmotz/trystero#receiver
     */
    getPeerMetadata?: Function | null
    hasBooted: boolean
    // Set permanently the first time a RAINBOW-colored cow produces
    // rainbow-fertilizer - rainbow-fertilizer's only acquisition path
    // today. Used to gate the rainbow-mulch recipe so it doesn't show up
    // before the player has ever actually gotten one.
    hasProducedRainbowFertilizer: boolean
    heartbeatTimeoutId: number | null
    historicalDailyLosses: number[]
    historicalDailyRevenue: number[]
    /**
     * Currently there is only one element in this array, but it will be used for more historical price data analysis in the future. It is an array for future-facing flexibility.
     */
    historicalValueAdjustments: Record<string, number>[]
    hoveredPlotRangeSize: number
    playerId: string
    inventory: { id: item['id']; quantity: number }[]
    /**
     * Is -1 if inventory is unlimited.
     */
    inventoryLimit: number
    isAwaitingCowTradeRequest: boolean
    isAwaitingNetworkRequest: boolean
    isCombineEnabled: boolean
    isMenuOpen: boolean
    /**
     * Keys are items IDs, values are the number of that item sold. The numbers in this map are inclusive of the corresponding ones in cellarItemsSold and represent the grand total of each item sold.
     */
    itemsSold: Partial<Record<item['id'], number>>
    /**
     * Keys are items IDs, values are the number of that cellar item sold. The numbers in this map represent a subset of the corresponding ones in itemsSold. cellarItemsSold is intended to be used for internal bookkeeping.
     */
    cellarItemsSold: Partial<Record<item['id'], number>>
    /**
     * A map of totals of recipes crafted via the Workshop. Keys are recipe
     * (item) IDs, values are the number of that recipe made.
     */
    recipesMade: Partial<Record<item['id'], number>>
    /**
     * Whether the chat modal is open.
     */
    isChatOpen: boolean
    isDialogViewOpen: boolean
    /**
     * Whether the player is playing online.
     */
    isOnline: boolean
    isWaitingForDayToCompleteIncrementing: boolean
    /**
     * Keys are recipe IDs, values are `true`.
     */
    learnedRecipes: Partial<Record<string, boolean>>
    loanBalance: number
    loansTakenOut: number
    money: number
    latestNotification?: notification | null
    newDayNotifications: notification[]
    notificationLog: notificationLogEntry[]
    /**
     * Keys are (Trystero) peer ids, values are their respective metadata or null.
     */
    peers: Partial<Record<string, peerMetadata | null>>
    /**
     * See https://github.com/dmotz/trystero
     */
    peerRoom?: any
    /**
     * An array of messages to be sent to the Trystero peer room upon the next broadcast.
     */
    pendingPeerMessages: peerMessage[]
    /**
     * An array of messages that have been received from peers.
     */
    latestPeerMessages: peerMessage[]
    /**
     * See https://github.com/dmotz/trystero
     */
    sendPeerMetadata?: Function | null
    selectedCowId: string
    selectedForestItemId: string
    selectedItemId: string
    /**
     * Keys are itemIds.
     */
    priceCrashes: Partial<Record<string, priceEvent>>
    /**
     * Keys are itemIds.
     */
    priceSurges: Partial<Record<string, priceEvent>>
    purchasedCombine: number
    purchasedComposter: number
    purchasedCowPen: number
    purchasedCellar: number
    purchasedField: number
    purchasedForest: number
    purchasedSmelter: number
    purchasedWoodChipper: number
    profitabilityStreak: number
    record7dayProfitAverage: number
    recordProfitabilityStreak: number
    recordSingleDayProfit: number
    /**
     * The amount of money the player has generated in
     */
    revenue: number
    /**
     * Transient value used to drive router redirection.
     */
    redirect: string
    /**
     * What online room the player is in.
     */
    room: string
    /**
     * https://github.com/dmotz/trystero#sender
     */
    sendCowAccept?: Function | null
    /**
     * https://github.com/dmotz/trystero#sender
     */
    sendCowReject?: Function | null
    /**
     * https://github.com/dmotz/trystero#sender
     */
    sendCowTradeRequest?: Function | null
    /**
     * Option to show the Home Screen
     */
    showHomeScreen: boolean
    showNotifications: boolean
    /**
     * indicating if the stage has been unlocked
     */
    stageFocus: import('./enums.js').stageFocusType
    todaysNotifications: notification[]
    /**
     * Should always be a negative number.
     */
    todaysLosses: number
    /**
     * Keys are item names, values are their respective quantities.
     */
    todaysPurchases: Partial<Record<string, number>>
    /**
     * Should always be a positive number.
     */
    todaysRevenue: number
    /**
     * Keys are item names, values are their respective quantities.
     */
    todaysStartingInventory: Partial<Record<item['id'], number>>
    toolLevels: Record<
      import('./enums.js').toolType,
      import('./enums.js').toolLevel
    >
    /**
     * Option to display the Bed button on the left side of the screen.
     */
    useAlternateEndDayButtonPosition: boolean
    valueAdjustments: Record<string, number>
    /**
     * Comes from the `version` property in package.json.
     */
    version: string
  }
}
