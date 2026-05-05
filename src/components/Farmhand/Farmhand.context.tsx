import { createContext } from 'react'

// eslint-disable-next-line no-unused-vars
import uiEventHandlers from '../../handlers/ui-events.js'
import { generateCow } from '../../utils/index.js'
import { scarecrow } from '../../data/items.js'

/**
 * A utility type that transforms a type containing functions with an explicit `this` parameter
 * into a type where those functions no longer require `this` to be provided at the call site.
 *
 * This is used for event handlers that are defined in standalone modules but are bound
 * to the `Farmhand` class instance at runtime. Once bound, the `this` context is
 * automatically handled, so the type should reflect that callers don't need to provide it.
 *
 * @template T - The type to transform (usually an object of event handler functions).
 */
export type BoundHandlers<T> = {
  [K in keyof T]: T[K] extends (this: any, ...args: infer A) => infer R
    ? (...args: A) => R
    : T[K]
}

export interface ContextData {
  gameState: farmhand.state & {
    blockInput: boolean
    features: Record<string, boolean | undefined>
    fieldToolInventory: farmhand.item[]
    isChatAvailable: boolean
    levelEntitlements: farmhand.levelEntitlements
    plantableCropInventory: farmhand.item[]
    playerInventory: farmhand.item[]
    playerInventoryQuantities: Record<string, number>
    shopInventory: farmhand.item[]
    viewList: farmhand.stageFocusType[]
    viewTitle: string
  }
  handlers: BoundHandlers<typeof uiEventHandlers> & {
    debounced: BoundHandlers<typeof uiEventHandlers>
  }
}

export const createContextData = (): ContextData => {
  return {
    gameState: {
      viewTitle: '',
      viewList: [] as farmhand.stageFocusType[],
      features: {},
      blockInput: false,
      shopInventory: [] as farmhand.item[],
      isChatAvailable: false,
      playerInventory: [] as farmhand.item[],
      levelEntitlements: {
        items: {},
        tools: {},
        sprinklerRange: 0,
        stageFocusType: {},
      },
      fieldToolInventory: [] as farmhand.item[],
      plantableCropInventory: [] as farmhand.item[],
      playerInventoryQuantities: {},
      activePlayers: null,
      allowCustomPeerCowNames: false,
      cellarInventory: [],
      currentDialogView: 'NONE' as farmhand.dialogView,
      completedAchievements: {},
      cowForSale: generateCow() as farmhand.cow,
      cowBreedingPen: {
        cowId1: null,
        cowId2: null,
        daysUntilBirth: 0,
      },
      cowInventory: [],
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
        SUNFLOWER: 0,
        STRAWBERRY: 0,
        SWEET_POTATO: 0,
        TOMATO: 0,
        WATERMELON: 0,
        WHEAT: 0,
        WEED: 0,
      },
      dayCount: 0,
      experience: 0,
      farmName: '',
      field: [[]],
      forest: [[]],
      fieldMode: 'OBSERVE' as farmhand.fieldMode,
      getCowAccept: () => {},
      getCowReject: () => {},
      getCowTradeRequest: () => {},
      getPeerMetadata: () => {},
      hasBooted: true,
      heartbeatTimeoutId: -1,
      historicalDailyLosses: [],
      historicalDailyRevenue: [],
      historicalValueAdjustments: [], // empty array for now
      hoveredPlotRangeSize: 0,
      playerId: '',
      inventory: [{ id: scarecrow.id, quantity: 1 }],
      inventoryLimit: -1,
      isAwaitingCowTradeRequest: false,
      isAwaitingNetworkRequest: false,
      isCombineEnabled: true,
      isMenuOpen: false,
      itemsSold: {},
      cellarItemsSold: {},
      isChatOpen: false,
      isDialogViewOpen: false,
      isOnline: true,
      isWaitingForDayToCompleteIncrementing: false,
      learnedRecipes: {},
      loanBalance: 0,
      loansTakenOut: 0,
      money: 0,
      latestNotification: null,
      newDayNotifications: [],
      notificationLog: [],
      peers: {}, // empty object for now
      peerRoom: null,
      pendingPeerMessages: [],
      latestPeerMessages: [],
      sendCowAccept: () => {},
      sendCowReject: () => {},
      sendCowTradeRequest: () => {},
      sendPeerMetadata: () => {},
      selectedCowId: '',
      selectedItemId: '',
      priceCrashes: {},
      priceSurges: {},
      purchasedCombine: 0,
      purchasedComposter: 0,
      purchasedCowPen: 0,
      purchasedCellar: 0,
      purchasedField: 0,
      purchasedForest: 0,
      purchasedSmelter: 0,
      profitabilityStreak: 0,
      record7dayProfitAverage: 0,
      recordProfitabilityStreak: 0,
      recordSingleDayProfit: 0,
      revenue: 0,
      redirect: '',
      room: '',
      showHomeScreen: true,
      showNotifications: true,
      stageFocus: 'HOME' as farmhand.stageFocusType,
      todaysLosses: 0,
      todaysPurchases: {},
      todaysRevenue: 0,
      todaysStartingInventory: {},
      toolLevels: {
        SCYTHE: 'DEFAULT',
        SHOVEL: 'DEFAULT',
        HOE: 'DEFAULT',
        WATERING_CAN: 'DEFAULT',
      } as Record<farmhand.toolType, farmhand.toolLevel>,
      valueAdjustments: {},
      version: '1.0.0',
      todaysNotifications: [],
      useAlternateEndDayButtonPosition: false,
    },
    handlers: {
      ...uiEventHandlers,
      debounced: {
        ...uiEventHandlers,
      },
    },
  }
}

/**
 * @type {import('react').Context<ContextData>}
 */
const FarmhandContext = createContext<ContextData>(createContextData())

export default FarmhandContext
