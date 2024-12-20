/**
 * @typedef {import('../../').farmhand.item} farmhand.item
 * @typedef {import('../../').farmhand.levelEntitlements} farmhand.levelEntitlements
 * @typedef {import('./Farmhand.js').farmhand.state} farmhand.state
 */
import { createContext } from 'react'

// eslint-disable-next-line no-unused-vars
import uiEventHandlers from '../../handlers/ui-events.js'
import { generateCow } from '../../utils/index.js'

/**
 * @typedef {{
 *   gameState: farmhand.state & {
 *     blockInput: boolean,
 *     features: Record<string, boolean>,
 *     fieldToolInventory: farmhand.item[],
 *     isChatAvailable: boolean,
 *     levelEntitlements: farmhand.levelEntitlements,
 *     plantableCropInventory: farmhand.item[],
 *     playerInventory: farmhand.item[],
 *     playerInventoryQuantities: Record<string, number>,
 *     shopInventory: farmhand.item[],
 *     viewList: string[],
 *     viewTitle: string,
 *   }
 *   handlers: uiEventHandlers & { debounced: uiEventHandlers }
 * }} contextData
 */

/**
 * @returns {contextData}
 */
export const createContextData = () => {
  return {
    gameState: {
      viewTitle: '',
      viewList: [],
      features: {},
      blockInput: false,
      shopInventory: [],
      isChatAvailable: false,
      playerInventory: [],
      levelEntitlements: {
        items: {},
        tools: {},
        sprinklerRange: 0,
      },
      fieldToolInventory: [],
      plantableCropInventory: [],
      playerInventoryQuantities: {},
      activePlayers: null,
      allowCustomPeerCowNames: false,
      cellarInventory: [],
      currentDialogView: '',
      completedAchievements: {},
      cowForSale: generateCow(),
      cowBreedingPen: {
        cowId1: null,
        cowId2: null,
        daysUntilBirth: 0,
      },
      cowInventory: [],
      cowColorsPurchased: {},
      cowIdOfferedForTrade: '',
      cowsSold: {},
      cowsTraded: 0,
      cowTradeTimeoutId: null,
      cropsHarvested: {},
      dayCount: 0,
      experience: 0,
      farmName: '',
      field: [[]],
      forest: [[]],
      fieldMode: 'default',
      getCowAccept: () => {},
      getCowReject: () => {},
      getCowTradeRequest: () => {},
      getPeerMetadata: () => {},
      hasBooted: true,
      heartbeatTimeoutId: null,
      historicalDailyLosses: [],
      historicalDailyRevenue: [],
      historicalValueAdjustments: [], // empty array for now
      hoveredPlotRangeSize: 0,
      id: '',
      inventory: [{ id: '', quantity: 0 }],
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
      stageFocus: 'default',
      todaysLosses: 0,
      todaysPurchases: {},
      todaysRevenue: 0,
      todaysStartingInventory: {},
      toolLevels: {}, // empty object for now
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
 * @type {import('react').Context<contextData>}
 */
const FarmhandContext = createContext(createContextData())

export default FarmhandContext
