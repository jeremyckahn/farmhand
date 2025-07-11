/**
 * @typedef {import("../../index").farmhand.item} farmhand.item
 * @typedef {import("../../index").farmhand.cow} farmhand.cow
 * @typedef {import("../../index").farmhand.cowBreedingPen} farmhand.cowBreedingPen
 * @typedef {import("../../index").farmhand.forestForageable} farmhand.forestForageable
 * @typedef {import("../../index").farmhand.keg} farmhand.keg
 * @typedef {import("../../index").farmhand.plantedTree} farmhand.plantedTree
 * @typedef {import("../../index").farmhand.plotContent} farmhand.plotContent
 * @typedef {import("../../index").farmhand.peerMessage} farmhand.peerMessage
 * @typedef {import("../../index").farmhand.peerMetadata} farmhand.peerMetadata
 * @typedef {import("../../index").farmhand.priceEvent} farmhand.priceEvent
 * @typedef {import("../../index").farmhand.notification} farmhand.notification
 * @typedef {import("../../enums").cowColors} farmhand.cowColors
 * @typedef {import("../../enums").cropType} farmhand.cropType
 * @typedef {import("../../enums").dialogView} farmhand.dialogView
 * @typedef {import("../../enums").fieldMode} farmhand.fieldMode
 * @typedef {import("../../enums").stageFocusType} farmhand.stageFocusType
 */
import React from 'react'
import window from 'global/window.js'
import { Redirect } from 'react-router-dom'
import { GlobalHotKeys } from 'react-hotkeys'
import localforage from 'localforage'
import { v4 as uuid } from 'uuid'
import {
  ThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles/index.js'
import Drawer from '@mui/material/Drawer/index.js'
import Fab from '@mui/material/Fab/index.js'
import MenuIcon from '@mui/icons-material/Menu.js'
import HotelIcon from '@mui/icons-material/Hotel.js'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft.js'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import MobileStepper from '@mui/material/MobileStepper/index.js'
// NOTE: This path is aliased to tryster/torrent in vite.config.js. The actual
// path can't be used here because it breaks either Vite or TypeScript.
import { joinRoom } from 'trystero'
import { SnackbarProvider } from 'notistack'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import classNames from 'classnames'
import { object } from 'prop-types'

import eventHandlers from '../../handlers/ui-events.js'
import {
  handlePeerMetadataRequest,
  handleCowTradeRequest,
  handleCowTradeRequestAccept,
  handleCowTradeRequestReject,
} from '../../handlers/peer-events.js'
import * as reducers from '../../game-logic/reducers/index.js'
// This must be imported here so that it can be overridden by component styles.
import './Farmhand.sass'

import AppBar from '../AppBar/index.js'
import Navigation from '../Navigation/index.js'
import ContextPane from '../ContextPane/index.js'
import Stage from '../Stage/index.js'
import NotificationSystem, {
  snackbarProviderContentCallback,
} from '../NotificationSystem/index.js'
import UpdateNotifier from '../UpdateNotifier/index.js'
import theme from '../../mui-theme.js'
import { levelAchieved } from '../../utils/levelAchieved.js'
import {
  computeMarketPositions,
  createNewField,
  createNewForest,
  doesMenuObstructStage,
  generateCow,
  getAvailableShopInventory,
  getItemCurrentValue,
  getPeerMetadata,
  inventorySpaceRemaining,
  moneyTotal,
  nullArray,
  reduceByPersistedKeys,
  sleep,
  transformStateDataForImport,
} from '../../utils/index.js'
import { noop } from '../../utils/noop.js'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements.js'
import { memoize } from '../../utils/memoize.js'
import { getData, postData } from '../../fetch-utils.js'
import { itemsMap, recipesMap } from '../../data/maps.js'
import {
  dialogView,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../../enums.js'
import {
  COW_TRADE_TIMEOUT,
  DEFAULT_ROOM,
  HEARTBEAT_INTERVAL_PERIOD,
  INITIAL_STORAGE_LIMIT,
  STAGE_TITLE_MAP,
  STANDARD_LOAN_AMOUNT,
  Z_INDEX,
  STANDARD_VIEW_LIST,
} from '../../constants.js'
import {
  CONNECTED_TO_ROOM,
  LOAN_INCREASED,
  POSITIONS_POSTED_NOTIFICATION,
  RECIPE_LEARNED,
  RECIPES_LEARNED,
} from '../../templates.js'
import {
  CONNECTING_TO_SERVER,
  COW_ALREADY_OWNED,
  DATA_DELETED,
  DISCONNECTED_FROM_SERVER,
  INVENTORY_FULL_NOTIFICATION,
  PROGRESS_SAVED_MESSAGE,
  REQUESTED_COW_TRADE_UNAVAILABLE,
  SERVER_ERROR,
} from '../../strings.js'
import { endpoints, features, rtcConfig, relayUrls } from '../../config.js'

import { scarecrow } from '../../data/items.js'

import { ChatRoom } from '../ChatRoom/index.js'

import { getInventoryQuantities } from './helpers/getInventoryQuantities.js'
import FarmhandContext from './Farmhand.context.js'
import { FarmhandReducers } from './FarmhandReducers.js'

const { CLEANUP, HARVEST, MINE, OBSERVE, WATER, PLANT } = fieldMode

// Utility object for reuse in no-ops to save on memory
const emptyObject = Object.freeze({})

export const computePlayerInventory = memoize(
  /**
   * @param {{ id: farmhand.item['id'], quantity: number }[]} inventory
   * @param {Record<string, number>} valueAdjustments
   * @returns {farmhand.item[]}
   */
  (inventory, valueAdjustments) =>
    inventory.map(({ quantity, id }) => ({
      quantity,
      ...itemsMap[id],
      value: getItemCurrentValue(itemsMap[id], valueAdjustments),
    }))
)

export const getFieldToolInventory = memoize(
  /**
   * @param {farmhand.state['inventory']} inventory
   * @returns {farmhand.item[]}
   */
  inventory =>
    inventory
      .filter(({ id }) => {
        const { enablesFieldMode } = itemsMap[id]

        return (
          typeof enablesFieldMode === 'string' && enablesFieldMode !== PLANT
        )
      })
      .map(({ id }) => itemsMap[id])
)

export const getPlantableCropInventory = memoize(
  /**
   * @param {farmhand.state['inventory']} inventory
   * @returns {farmhand.item[]}
   */
  inventory =>
    inventory
      .filter(({ id }) => itemsMap[id].isPlantableCrop)
      .map(({ id }) => itemsMap[id])
)

/**
 * @param {Record<string, number>} valueAdjustments
 * @param {Record<string, farmhand.priceEvent>} priceCrashes
 * @param {Record<string, farmhand.priceEvent>} priceSurges
 * @returns {Record<string, number>}
 */
const applyPriceEvents = (valueAdjustments, priceCrashes, priceSurges) => {
  const patchedValueAdjustments = { ...valueAdjustments }

  Object.keys(priceCrashes).forEach(itemId => {
    patchedValueAdjustments[itemId] = 0.5
  })
  Object.keys(priceSurges).forEach(itemId => {
    patchedValueAdjustments[itemId] = 1.5
  })

  return patchedValueAdjustments
}

/**
 * @typedef farmhand.state
 * @type {Object}
 * @property {number?} activePlayers
 * @property {boolean} allowCustomPeerCowNames
 * @property {Array.<farmhand.keg>} cellarInventory
 * @property {farmhand.dialogView} currentDialogView
 * @property {Object.<string, boolean>} completedAchievements Keys are
 * achievement ids.
 * @property {farmhand.cow} cowForSale
 * @property {farmhand.cowBreedingPen} cowBreedingPen
 * @property {Array.<farmhand.cow>} cowInventory
 * @property {Object.<farmhand.cowColors, number>} cowColorsPurchased Keys are
 * color enums, values are the number of that color of cow purchased.
 * @property {string} cowIdOfferedForTrade The ID of the cow that is currently
 * set to be traded with online peers.
 * @property {Object} cowsSold Keys are items IDs, values are the id references
 * of cow colors (rainbow-cow, etc.).
 * @property {number} cowsTraded
 * @property {number?} cowTradeTimeoutId
 * @property {Object.<farmhand.cropType, number>} cropsHarvested A map of
 * totals of crops harvested. Keys are crop type IDs, values are the number of
 * that crop harvested.
 * @property {number} dayCount
 * @property {number} experience
 * @property {string} farmName
 * @property {(?farmhand.plotContent)[][]} field
 * @property {(farmhand.plantedTree | farmhand.forestForageable | null)[][]} forest
 * @property {farmhand.fieldMode} fieldMode
 * @property {Function?} getCowAccept https://github.com/dmotz/trystero#receiver
 * @property {Function?} getCowReject https://github.com/dmotz/trystero#receiver
 * @property {Function?} getCowTradeRequest https://github.com/dmotz/trystero#receiver
 * @property {Function?} getPeerMetadata https://github.com/dmotz/trystero#receiver
 * @property {boolean} hasBooted
 * @property {number?} heartbeatTimeoutId
 * @property {Array.<number>} historicalDailyLosses
 * @property {Array.<number>} historicalDailyRevenue
 * @property {Record<string, number>[]} historicalValueAdjustments
 * Currently there is only one element in this array, but it will be used for
 * more historical price data analysis in the future. It is an array for
 * future-facing flexibility.
 * @property {number} hoveredPlotRangeSize
 * @property {string} id
 * @property {{ id: farmhand.item['id'], quantity: number }[]} inventory
 * @property {number} inventoryLimit Is -1 if inventory is unlimited.
 * @property {boolean} isAwaitingCowTradeRequest
 * @property {boolean} isAwaitingNetworkRequest
 * @property {boolean} isCombineEnabled
 * @property {boolean} isMenuOpen
 * @property {Record<farmhand.item['id'], number>} itemsSold Keys are items
 * IDs, values are the number of that item sold. The numbers in this map are
 * inclusive of the corresponding ones in cellarItemsSold and represent the
 * grand total of each item sold.
 * @property {Object} cellarItemsSold Keys are items IDs, values are the number
 * of that cellar item sold. The numbers in this map represent a subset of the
 * corresponding ones in itemsSold. cellarItemsSold is intended to be used for
 * internal bookkeeping.
 * @property {boolean} isChatOpen Whether the chat modal is open.
 * @property {boolean} isDialogViewOpen
 * @property {boolean} isOnline Whether the player is playing online.
 * @property {boolean} isWaitingForDayToCompleteIncrementing
 * @property {Object} learnedRecipes Keys are recipe IDs, values are `true`.
 * @property {number} loanBalance
 * @property {number} loansTakenOut
 * @property {number} money
 * @property {farmhand.notification?} latestNotification
 * @property {Array.<farmhand.notification>} newDayNotifications
 * @property {Array.<farmhand.notification>} notificationLog
 * @property {Record<string, farmhand.peerMetadata?>} peers Keys are (Trystero)
 * peer ids, values are their respective metadata or null.
 * @property {Object?} peerRoom See https://github.com/dmotz/trystero
 * @property {farmhand.peerMessage[]} pendingPeerMessages An array of messages
 * to be sent to the Trystero peer room upon the next broadcast.
 * @property {farmhand.peerMessage[]} latestPeerMessages An array of messages
 * that have been received from peers.
 * @property {function?} sendPeerMetadata See https://github.com/dmotz/trystero
 * @property {string} selectedCowId
 * @property {string} selectedItemId
 * @property {Object.<string, farmhand.priceEvent>} priceCrashes Keys are
 * itemIds.
 * @property {Object.<string, farmhand.priceEvent>} priceSurges Keys are
 * itemIds.
 * @property {number} purchasedCombine
 * @property {number} purchasedComposter
 * @property {number} purchasedCowPen
 * @property {number} purchasedCellar
 * @property {number} purchasedField
 * @property {number} purchasedForest
 * @property {number} purchasedSmelter
 * @property {number} profitabilityStreak
 * @property {number} record7dayProfitAverage
 * @property {number} recordProfitabilityStreak
 * @property {number} recordSingleDayProfit
 * @property {number} revenue The amount of money the player has generated in
 * @property {string} redirect Transient value used to drive router redirection.
 * @property {string} room What online room the player is in.
 * @property {Function?} sendCowAccept https://github.com/dmotz/trystero#sender
 * @property {Function?} sendCowReject https://github.com/dmotz/trystero#sender
 * @property {Function?} sendCowTradeRequest https://github.com/dmotz/trystero#sender
 * @property {Function?} sendPeerMetadata https://github.com/dmotz/trystero#sender
 * @property {boolean} showHomeScreen Option to show the Home Screen
 * @property {boolean} showNotifications
 * @property {farmhand.stageFocusType} stageFocus
 * indicating if the stage has been unlocked
 * @property {Array.<farmhand.notification>} todaysNotifications
 * @property {number} todaysLosses Should always be a negative number.
 * @property {Object} todaysPurchases Keys are item names, values are their
 * respective quantities.
 * @property {number} todaysRevenue Should always be a positive number.
 * @property {Record<farmhand.item['id'], number>} todaysStartingInventory Keys
 * are item names, values are their respective quantities.
 * @property {Record<toolType, toolLevel>} toolLevels
 * @property {boolean} useAlternateEndDayButtonPosition Option to display the
 * Bed button on the left side of the screen.
 * @property {Record<string, number>} valueAdjustments
 * @property {string} version Comes from the `version` property in
 * package.json.
 */

export default class Farmhand extends FarmhandReducers {
  /*!
   * @member farmhand.Farmhand#state
   * @type {farmhand.state}
   */
  state = this.createInitialState()

  // NOTE: This object construction is overwritten in initInputHandlers with
  // properly-bound versions of each handler function. They are initially
  // defined here as stubs in order to inform the type checker of the
  // appropriate object structure.
  handlers = {
    ...eventHandlers,
    debounced: { ...eventHandlers },
  }

  /**
   * @type {Record<string, string>}
   */
  keyMap = {}

  /**
   * @type {Record<string, () => void>}
   */
  keyHandlers = {}

  static defaultProps = {
    localforage: localforage.createInstance({
      name: 'farmhand',
      description: 'Persisted game data for Farmhand',
    }),
    features: {},
    match: { path: '', params: {} },
  }

  /**
   * @param {typeof Farmhand.defaultProps} props
   */
  constructor(props) {
    super(props)

    this.initInputHandlers()

    // This is an antipattern, but it's useful for debugging. The Farmhand
    // component assumes that it is a singleton.
    window.farmhand = this
  }

  getData = getData
  postData = postData

  get viewTitle() {
    return STAGE_TITLE_MAP[this.state.stageFocus]
  }

  get fieldToolInventory() {
    return getFieldToolInventory(this.state.inventory)
  }

  get playerInventory() {
    const { inventory, valueAdjustments } = this.state
    return computePlayerInventory(inventory, valueAdjustments)
  }

  get plantableCropInventory() {
    return getPlantableCropInventory(this.state.inventory)
  }

  get viewList() {
    const { CELLAR, COW_PEN, HOME, WORKSHOP, FOREST } = stageFocusType
    const viewList = [...STANDARD_VIEW_LIST]

    if (this.state.showHomeScreen) {
      viewList.unshift(HOME)
    }

    if (this.isForestUnlocked && features.FOREST) {
      viewList.push(FOREST)
    }

    if (this.state.purchasedCowPen) {
      viewList.push(COW_PEN)
    }

    viewList.push(WORKSHOP)

    if (this.state.purchasedCellar) {
      viewList.push(CELLAR)
    }

    return viewList
  }

  get levelEntitlements() {
    return getLevelEntitlements(levelAchieved(this.state.experience))
  }

  get shopInventory() {
    return getAvailableShopInventory(this.levelEntitlements)
  }

  get peerMetadata() {
    return getPeerMetadata(this.state)
  }

  get isInputBlocked() {
    return (
      this.state.isAwaitingNetworkRequest ||
      this.state.isAwaitingCowTradeRequest ||
      this.state.isWaitingForDayToCompleteIncrementing
    )
  }

  get isChatAvailable() {
    const { isOnline, room } = this.state
    return isOnline && room !== DEFAULT_ROOM
  }

  get isForestUnlocked() {
    return this.levelEntitlements.stageFocusType[stageFocusType.FOREST]
  }

  /**
   * @returns {farmhand.state}
   */
  createInitialState() {
    return {
      activePlayers: null,
      allowCustomPeerCowNames: false,
      cellarInventory: [],
      currentDialogView: dialogView.NONE,
      completedAchievements: {},
      cowForSale: generateCow(),
      cowBreedingPen: {
        cowId1: null,
        cowId2: null,
        daysUntilBirth: -1,
      },
      cowColorsPurchased: {},
      cowIdOfferedForTrade: '',
      cowInventory: [],
      cowsSold: {},
      cowsTraded: 0,
      cowTradeTimeoutId: -1,
      cropsHarvested: {},
      dayCount: 0,
      experience: 0,
      farmName: 'Unnamed',
      field: createNewField(),
      fieldMode: OBSERVE,
      forest: createNewForest(),
      getCowAccept: noop,
      getCowReject: noop,
      getCowTradeRequest: noop,
      getPeerMetadata: noop,
      hasBooted: false,
      heartbeatTimeoutId: null,
      historicalDailyLosses: [],
      historicalDailyRevenue: [],
      historicalValueAdjustments: [],
      hoveredPlotRangeSize: 0,
      id: uuid(),
      inventory: [{ id: scarecrow.id, quantity: 1 }],
      inventoryLimit: INITIAL_STORAGE_LIMIT,
      isAwaitingCowTradeRequest: false,
      isAwaitingNetworkRequest: false,
      isCombineEnabled: false,
      isMenuOpen: !doesMenuObstructStage(),
      itemsSold: {},
      cellarItemsSold: {},
      isChatOpen: false,
      isDialogViewOpen: false,
      isOnline: this.props.match.path.startsWith('/online'),
      isWaitingForDayToCompleteIncrementing: false,
      learnedRecipes: {},
      loanBalance: STANDARD_LOAN_AMOUNT,
      loansTakenOut: 1,
      money: STANDARD_LOAN_AMOUNT,
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
      room: decodeURIComponent(this.props.match.params.room || DEFAULT_ROOM),
      sendCowAccept: noop,
      sendCowReject: noop,
      purchasedCombine: 0,
      purchasedComposter: 0,
      purchasedCowPen: 0,
      purchasedCellar: 0,
      purchasedField: 0,
      purchasedForest: 0,
      purchasedSmelter: 0,
      sendCowTradeRequest: noop,
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
      version: import.meta.env?.VITE_FARMHAND_PACKAGE_VERSION ?? '',
    }
  }

  async initializeNewGame() {
    await this.incrementDay(true)

    this.setState(() => ({
      historicalValueAdjustments: [],
    }))

    this.showNotification(LOAN_INCREASED`${STANDARD_LOAN_AMOUNT}`, 'info')
  }

  initInputHandlers() {
    const debouncedInputRate = 50

    Object.keys(eventHandlers).forEach(method => {
      this.handlers[method] = eventHandlers[method].bind(this)

      this.handlers.debounced[method] = debounce(
        this.handlers[method],
        debouncedInputRate
      )
    })

    // NOTE: The dialog view mappings here MUST be kept in sync with the
    // dialogTriggerTextMap map in Navigation.js. They MUST also be kept in
    // sync with the player-facing documentation in KeybindingsView.js
    this.keyMap = {
      incrementDay: 'shift+c',
      nextView: 'right',
      openAccounting: 'b',
      openAchievements: 'a',
      openLog: 'l',
      openPriceEvents: 'e',
      openStats: 's',
      openSettings: ',',
      openKeybindings: 'shift+?',
      previousView: 'left',
      toggleMenu: 'm',
    }

    this.keyHandlers = {
      incrementDay: () => this.incrementDay(),
      nextView: this.focusNextView.bind(this),
      openAccounting: () => this.openDialogView(dialogView.ACCOUNTING),
      openAchievements: () => this.openDialogView(dialogView.ACHIEVEMENTS),
      openLog: () => this.openDialogView(dialogView.FARMERS_LOG),
      openPriceEvents: () => this.openDialogView(dialogView.PRICE_EVENTS),
      openStats: () => this.openDialogView(dialogView.STATS),
      openSettings: () => this.openDialogView(dialogView.SETTINGS),
      openKeybindings: () => this.openDialogView(dialogView.KEYBINDINGS),
      previousView: this.focusPreviousView.bind(this),
      selectHoe: () => this.handlers.handleFieldModeSelect(CLEANUP),
      selectScythe: () => this.handlers.handleFieldModeSelect(HARVEST),
      selectWateringCan: () => this.handlers.handleFieldModeSelect(WATER),
      selectShovel: () => {
        if (this.state.toolLevels[toolType.SHOVEL] !== toolLevel.UNAVAILABLE) {
          this.handlers.handleFieldModeSelect(MINE)
        }
      },
      toggleMenu: () => this.handlers.handleMenuToggle(),
    }

    nullArray(9).forEach((_, i) => {
      const index = i + 1
      const key = `numberKey${index}`
      this.keyMap[key] = String(index)
      this.keyHandlers[key] = () => {
        const viewName = this.viewList[i]

        if (typeof viewName === 'string') {
          this.setState({ stageFocus: stageFocusType[viewName] })
        }
      }
    })

    if (import.meta.env?.MODE === 'development') {
      Object.assign(this.keyMap, {
        clearPersistedData: 'shift+d',
        waterAllPlots: 'w',
      })
    }

    Object.assign(this.keyHandlers, {
      clearPersistedData: () => this.clearPersistedData(),
      waterAllPlots: () => this.waterAllPlots(),
    })
  }

  async componentDidMount() {
    const state = await this.props.localforage.getItem('state')

    if (state) {
      const sanitizedState = transformStateDataForImport({
        ...this.createInitialState(),
        ...state,
      })
      const { isCombineEnabled, newDayNotifications } = sanitizedState

      this.setState({ ...sanitizedState, newDayNotifications: [] }, () => {
        newDayNotifications.forEach(({ message, severity }) => {
          // Defer these notifications so that notistack doesn't swallow all
          // but the last one.
          setTimeout(() => this.showNotification(message, severity), 0)

          if (isCombineEnabled) {
            this.forRange(reducers.harvestPlot, Infinity, 0, 0)
          }
        })
      })
    } else {
      await this.initializeNewGame()
    }

    this.syncToRoom()

    this.setState({ hasBooted: true })
  }

  componentDidUpdate(_prevProps, prevState) {
    const {
      hasBooted,
      heartbeatTimeoutId,
      isMenuOpen,
      isOnline,
      money,
      peerRoom,
      room,
      stageFocus,
    } = this.state

    // The operations after this if block concern transient gameplay state, but
    // componentDidUpdate runs as part of the rehydration/bootup process. So,
    // check to see if the app has completed booting before doing anything with
    // this transient state.
    if (!hasBooted) {
      return
    }

    const {
      match: {
        path,
        params: { room: newRoom = room },
      },
    } = this.props

    const decodedRoom = decodeURIComponent(newRoom)

    // NOTE: This indicates that the client should attempt to connect to the server
    const newIsOnline = path.startsWith('/online')

    if (newIsOnline !== this.state.isOnline || decodedRoom !== room) {
      this.setState(() => ({
        isOnline: newIsOnline,
        redirect: '',
        room: decodedRoom,
      }))
    }

    if (isOnline !== prevState.isOnline || room !== prevState.room) {
      if (newIsOnline) {
        this.syncToRoom()
      }

      if (!isOnline && typeof heartbeatTimeoutId === 'number') {
        clearTimeout(heartbeatTimeoutId)
        this.setState({
          activePlayers: null,
          heartbeatTimeoutId: null,
          peerRoom: null,
        })
      }
    }

    if (isOnline === false && prevState.isOnline === true) {
      this.showNotification(DISCONNECTED_FROM_SERVER, 'info')
    }

    const updatedAchievementsState = reducers.updateAchievements(
      this.state,
      prevState
    )

    if (updatedAchievementsState !== this.state) {
      this.setState(() => updatedAchievementsState)
    }

    if (
      this.state.stageFocus === stageFocusType.COW_PEN &&
      prevState.stageFocus !== stageFocusType.COW_PEN
    ) {
      this.setState(() => ({ selectedCowId: '' }))
    }

    if (stageFocus !== prevState.stageFocus) {
      if (isMenuOpen) {
        this.setState(() => ({ isMenuOpen: !doesMenuObstructStage() }))
      }
    }

    if (money < prevState.money) {
      this.setState(({ todaysLosses }) => ({
        todaysLosses: moneyTotal(todaysLosses, money - prevState.money),
      }))
    }

    if (peerRoom !== prevState.peerRoom) {
      if (peerRoom) {
        peerRoom.onPeerJoin(id => {
          this.addPeer(id)
        })

        peerRoom.onPeerLeave(id => {
          this.removePeer(id)
        })

        const [sendPeerMetadata, getPeerMetadata] = peerRoom.makeAction(
          'peerMetadata'
        )

        getPeerMetadata((
          /** @type {[object, string]} */
          ...args
        ) => handlePeerMetadataRequest(this, ...args))

        const [sendCowTradeRequest, getCowTradeRequest] = peerRoom.makeAction(
          'cowTrade'
        )

        getCowTradeRequest((
          /** @type {[object, string]} */
          ...args
        ) => handleCowTradeRequest(this, ...args))

        const [sendCowAccept, getCowAccept] = peerRoom.makeAction('cowAccept')

        getCowAccept((
          /** @type {[object, string]} */
          ...args
        ) => handleCowTradeRequestAccept(this, ...args))

        const [sendCowReject, getCowReject] = peerRoom.makeAction('cowReject')

        getCowReject((
          /** @type {[object]} */
          ...args
        ) => handleCowTradeRequestReject(this, ...args))

        this.setState({
          getCowAccept,
          getCowReject,
          getCowTradeRequest,
          getPeerMetadata,
          pendingPeerMessages: [],
          sendCowAccept,
          sendCowReject,
          sendCowTradeRequest,
          sendPeerMetadata: this.wrapSendPeerMetadata(sendPeerMetadata),
        })

        sendPeerMetadata(this.peerMetadata)
      } else {
        // This player has gone offline.
        prevState.peerRoom.leave()
        this.setState({ peers: {}, sendPeerMetadata: null })
      }
    }

    ;[
      'showInventoryFullNotifications',
      'showRecipeLearnedNotifications',
    ].forEach(fn => this[fn](prevState))

    this.state.sendPeerMetadata?.(this.peerMetadata)
  }

  /**
   * @param {Function} sendPeerMetadata Raw send action callback created by
   * Trystero's makeAction function.
   * @return {Function}
   */
  wrapSendPeerMetadata(sendPeerMetadata) {
    return throttle(
      (...args) => {
        sendPeerMetadata(...args)

        this.setState(() => ({
          pendingPeerMessages: [],
        }))
      },
      5000,
      {
        trailing: true,
      }
    )
  }

  /**
   * @param {farmhand.cow} peerPlayerCow
   */
  tradeForPeerCow(peerPlayerCow) {
    this.setState(state => {
      const {
        cowIdOfferedForTrade,
        cowInventory,
        peers,
        sendCowTradeRequest,
      } = state

      if (!sendCowTradeRequest) return null

      const { ownerId } = peerPlayerCow

      const [peerId] =
        Object.entries(peers).find(([, peer]) => peer?.id === ownerId) ?? []

      if (!peerId) {
        console.error(
          `Owner not found for cow ${JSON.stringify(peerPlayerCow)}`
        )
        return null
      }

      const playerAlreadyOwnsRequestedCow = cowInventory.find(
        ({ id }) => id === peerPlayerCow.id
      )

      if (playerAlreadyOwnsRequestedCow) {
        console.error(`Cow ID ${peerPlayerCow.id} is already in inventory`)
        return reducers.showNotification(state, COW_ALREADY_OWNED, 'error')
      }

      const cowToTradeAway = cowInventory.find(
        ({ id }) => id === cowIdOfferedForTrade
      )

      if (!cowToTradeAway) {
        console.error(`Cow ID ${cowIdOfferedForTrade} not found`)
        return null
      }

      const cowTradeTimeoutId = setTimeout(
        this.handleCowTradeTimeout,
        COW_TRADE_TIMEOUT
      )

      sendCowTradeRequest(
        {
          cowOffered: { ...cowToTradeAway, isUsingHuggingMachine: false },
          cowRequested: peerPlayerCow,
        },
        peerId
      )

      return { cowTradeTimeoutId, isAwaitingCowTradeRequest: true }
    }, noop)
  }

  handleCowTradeTimeout = () => {
    if (typeof this.state.cowTradeTimeoutId === 'number') {
      this.showNotification(REQUESTED_COW_TRADE_UNAVAILABLE, 'error')
      this.setState({
        cowTradeTimeoutId: null,
        isAwaitingCowTradeRequest: false,
      })

      console.error('Cow trade request timed out')
    }
  }

  async clearPersistedData() {
    await this.props.localforage.clear()

    this.showNotification(DATA_DELETED)
  }

  async syncToRoom() {
    const { isOnline, priceCrashes, priceSurges, room } = this.state

    if (!isOnline) {
      return
    }

    this.showNotification(CONNECTING_TO_SERVER, 'info')

    try {
      this.setState({
        isAwaitingNetworkRequest: true,
        peers: {},
      })

      this.state.peerRoom?.leave()

      const { valueAdjustments } = await getData(endpoints.getMarketData, {
        farmId: this.state.id,
        room: room,
      })

      this.scheduleHeartbeat()

      const relayRedundancy = 4

      this.setState({
        activePlayers: 1,
        peerRoom: joinRoom(
          {
            appId: import.meta.env?.VITE_NAME,
            relayUrls,
            relayRedundancy,
            rtcConfig,
          },
          room
        ),
        valueAdjustments: applyPriceEvents(
          valueAdjustments,
          priceCrashes,
          priceSurges
        ),
      })

      this.showNotification(CONNECTED_TO_ROOM`${room}`, 'success')
    } catch (e) {
      // TODO: Add some reasonable fallback behavior in case the server request
      // fails. Possibility: Regenerate valueAdjustments and notify the user
      // they are offline.

      this.showNotification(SERVER_ERROR, 'error')

      console.error(e)

      // NOTE: Syncing failed, so take the user offline
      this.setState(() => {
        return {
          redirect: '/',
          cowIdOfferedForTrade: '',
        }
      })
    }

    this.setState({
      isAwaitingNetworkRequest: false,
      isAwaitingCowTradeRequest: false,
    })
  }

  scheduleHeartbeat() {
    const { heartbeatTimeoutId } = this.state
    clearTimeout(heartbeatTimeoutId ?? -1)

    this.setState(() => ({
      heartbeatTimeoutId: setTimeout(async () => {
        this.setState(({ money, activePlayers }) => ({
          activePlayers,
          money: moneyTotal(money, activePlayers),
        }))

        this.scheduleHeartbeat()
      }, HEARTBEAT_INTERVAL_PERIOD),
    }))
  }

  /**
   * @param {farmhand.state} prevState
   */
  showInventoryFullNotifications(prevState) {
    if (
      inventorySpaceRemaining(prevState) > 0 &&
      inventorySpaceRemaining(this.state) <= 0
    ) {
      this.showNotification(INVENTORY_FULL_NOTIFICATION, 'warning')
    }
  }

  /*!
   * @param {farmhand.state} prevState
   */
  showRecipeLearnedNotifications({ learnedRecipes: previousLearnedRecipes }) {
    let learnedRecipes = []

    Object.keys(this.state.learnedRecipes).forEach(recipeId => {
      if (!previousLearnedRecipes.hasOwnProperty(recipeId)) {
        learnedRecipes.push(recipesMap[recipeId])
      }
    })

    if (learnedRecipes.length > 1) {
      this.showNotification(RECIPES_LEARNED`${learnedRecipes}`)
    } else if (learnedRecipes.length === 1) {
      this.showNotification(RECIPE_LEARNED`${learnedRecipes[0]}`)
    }
  }

  /*!
   * @param {Object} [overrides] Data to patch into this.state when persisting.
   * @return {Promise}
   */
  persistState(overrides = {}) {
    return this.props.localforage.setItem(
      'state',
      reduceByPersistedKeys({
        ...this.state,
        ...overrides,
      })
    )
  }

  async updateServerForNextDay() {
    const serverMessages = []

    /**
     * @type {string | null}
     */
    let broadcastedPositionMessage = null

    this.setState(() => ({ isAwaitingNetworkRequest: true }))

    /**
     * @type {Record<string, number> | undefined}
     */
    let serverValueAdjustments

    if (this.state.isOnline) {
      const {
        inventory,
        room,
        todaysPurchases,
        todaysStartingInventory,
      } = this.state

      const positions = computeMarketPositions(
        todaysStartingInventory,
        todaysPurchases,
        inventory
      )

      try {
        serverValueAdjustments = (
          await postData(endpoints.postDayResults, {
            positions,
            room,
          })
        ).valueAdjustments

        if (Object.keys(positions).length) {
          serverMessages.push({
            message: POSITIONS_POSTED_NOTIFICATION`${'You'}${positions}`,
            severity: 'info',
          })

          broadcastedPositionMessage = POSITIONS_POSTED_NOTIFICATION`${''}${positions}`
        }
      } catch (e) {
        // NOTE: This will get reached when there's an issue posting data to the server.
        serverMessages.push({
          message: SERVER_ERROR,
          severity: 'error',
        })

        this.setState(() => ({
          redirect: '/',
          cowIdOfferedForTrade: '',
          isAwaitingNetworkRequest: false,
        }))

        console.error(e)
      }
    }

    return {
      broadcastedPositionMessage,
      serverMessages,
      serverValueAdjustments,
    }
  }

  async incrementDay(isFirstDay = false) {
    const {
      broadcastedPositionMessage,
      serverMessages,
      serverValueAdjustments,
    } = await this.updateServerForNextDay()

    /** @type {farmhand.notification[]} */
    let pendingNotifications = []

    // This would be cleaner if setState was called after localForage.setItem,
    // but updating the state first makes for a more responsive user
    // experience. The persisted state is computed post-update and stored
    // asynchronously, thus avoiding state changes from being blocked.
    this.setState(
      /**
       * @param {farmhand.state} prev
       * @return {Partial<farmhand.state>}
       */
      prev => {
        const nextDayState = reducers.computeStateForNextDay(prev, isFirstDay)

        pendingNotifications = [
          ...serverMessages,
          ...nextDayState.newDayNotifications,
        ]

        nextDayState.valueAdjustments = applyPriceEvents(
          serverValueAdjustments ?? nextDayState.valueAdjustments,
          nextDayState.priceCrashes,
          nextDayState.priceSurges
        )

        nextDayState.isAwaitingNetworkRequest = false

        return {
          ...nextDayState,
          isWaitingForDayToCompleteIncrementing: true,
          newDayNotifications: [],
          todaysNotifications: [],
        }
      },
      async () => {
        try {
          await this.persistState({
            // Old pendingNotifications are persisted so that they can be
            // shown to the player when the app reloads.
            newDayNotifications: pendingNotifications,
          })

          const notifications = [...pendingNotifications]

          notifications
            .concat(
              isFirstDay
                ? []
                : [{ message: PROGRESS_SAVED_MESSAGE, severity: 'info' }]
            )
            .forEach(({ message, severity }) =>
              this.showNotification(message, severity)
            )

          if (this.state.isCombineEnabled) {
            if (this.state.stageFocus === stageFocusType.FIELD) {
              // Allow the mature crops' animation to complete.
              await sleep(1000)
            }

            this.forRange(reducers.harvestPlot, Infinity, 0, 0)
          }
        } catch (e) {
          console.error(e)

          this.showNotification(JSON.stringify(e), 'error')
        } finally {
          this.setState(() => ({
            isWaitingForDayToCompleteIncrementing: false,
          }))

          if (broadcastedPositionMessage) {
            this.messagePeers(broadcastedPositionMessage)
          }
        }
      }
    )
  }

  /*!
   * @param {farmhand.module:enums.dialogView} dialogView
   */
  openDialogView(dialogView) {
    this.setState({ currentDialogView: dialogView, isDialogViewOpen: true })
  }

  closeDialogView() {
    this.setState({ isDialogViewOpen: false })
  }

  focusNextView() {
    if (document.activeElement?.getAttribute('role') === 'tab') return

    const { viewList } = this

    this.setState(({ stageFocus }) => {
      const currentViewIndex = viewList.indexOf(stageFocus)

      return { stageFocus: viewList[(currentViewIndex + 1) % viewList.length] }
    })
  }

  focusPreviousView() {
    if (document.activeElement?.getAttribute('role') === 'tab') return

    const { viewList } = this

    this.setState(({ stageFocus }) => {
      const currentViewIndex = viewList.indexOf(stageFocus)

      return {
        stageFocus:
          viewList[
            currentViewIndex === 0
              ? viewList.length - 1
              : (currentViewIndex - 1) % viewList.length
          ],
      }
    })
  }

  /**
   * @param {string} message
   * @param {string?} [severity]
   */
  messagePeers(message, severity) {
    this.prependPendingPeerMessage(message, severity)
  }

  render() {
    const {
      props: { features },
      state: { redirect },
      fieldToolInventory,
      handlers,
      isChatAvailable,
      keyHandlers,
      keyMap,
      levelEntitlements,
      plantableCropInventory,
      playerInventory,
      shopInventory,
      viewList,
      viewTitle,
    } = this

    const blockInput = this.isInputBlocked

    // Bundle up the raw state and the computed state into one object to be
    // passed down through the component tree.
    const gameState = {
      ...this.state,
      blockInput,
      features,
      fieldToolInventory,
      isChatAvailable,
      levelEntitlements,
      plantableCropInventory,
      playerInventory,
      playerInventoryQuantities: getInventoryQuantities(this.state.inventory),
      shopInventory,
      viewList,
      viewTitle,
    }

    return (
      <GlobalHotKeys
        {...{
          allowChanges: true,
          keyMap: blockInput ? emptyObject : keyMap,
          handlers: blockInput ? emptyObject : keyHandlers,
        }}
      >
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              {...{
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                classes: {
                  containerRoot: 'Farmhand notification-container',
                },
                content: snackbarProviderContentCallback,
                maxSnack: 4,
              }}
            >
              {redirect && <Redirect {...{ to: redirect }} />}
              <FarmhandContext.Provider value={{ gameState, handlers }}>
                <div
                  {...{
                    className: classNames(
                      'Farmhand farmhand-root fill',
                      this.state.isMenuOpen ? 'menu-open' : 'menu-closed',
                      {
                        'use-alternate-end-day-button-position': this.state
                          .useAlternateEndDayButtonPosition,
                        'block-input': blockInput,
                        'has-booted': this.state.hasBooted,
                      }
                    ),
                  }}
                >
                  <UpdateNotifier />
                  <AppBar />
                  <Drawer
                    {...{
                      className: 'sidebar-wrapper',
                      open: gameState.isMenuOpen,
                      variant: 'persistent',
                      role: 'complementary',
                      PaperProps: {
                        className: 'sidebar',
                      },
                    }}
                  >
                    <Navigation />
                    <ContextPane />
                    <div {...{ className: 'spacer' }} />
                  </Drawer>
                  <Stage />

                  {/*
                These controls need to be at this top level instead of the Stage
                because of scrolling issues in iOS.
                */}
                  <div className="bottom-controls">
                    <MobileStepper
                      variant="dots"
                      steps={viewList.length}
                      position="static"
                      activeStep={viewList.indexOf(this.state.stageFocus)}
                      className=""
                      backButton={null}
                      nextButton={null}
                    />
                    <div className="fab-buttons buttons">
                      <Fab
                        {...{
                          'aria-label': 'Previous view',
                          color: 'primary',
                          onClick: () => this.focusPreviousView(),
                        }}
                      >
                        <KeyboardArrowLeft />
                      </Fab>
                      <Fab
                        {...{
                          className: classNames('menu-button', {
                            'is-open': this.state.isMenuOpen,
                          }),
                          color: 'primary',
                          'aria-label': 'Open drawer',
                          onClick: () => handlers.handleMenuToggle(),
                        }}
                      >
                        <MenuIcon />
                      </Fab>
                      <Fab
                        {...{
                          'aria-label': 'Next view',
                          color: 'primary',
                          onClick: () => this.focusNextView(),
                        }}
                      >
                        <KeyboardArrowRight />
                      </Fab>
                    </div>
                  </div>
                  <Tooltip
                    {...{
                      placement: 'left',
                      title: (
                        <>
                          <p>
                            End the day to save your progress and advance the
                            game.
                          </p>
                          <p>(shift + c)</p>
                        </>
                      ),
                    }}
                  >
                    <Fab
                      {...{
                        'aria-label':
                          'End the day to save your progress and advance the game.',
                        className: 'end-day',
                        color: 'error',
                        onClick: handlers.handleClickEndDayButton,
                        sx: {
                          zIndex: Z_INDEX.END_DAY_BUTTON,
                        },
                      }}
                    >
                      <HotelIcon />
                    </Fab>
                  </Tooltip>
                </div>
                {isChatAvailable ? <ChatRoom /> : null}
                <NotificationSystem />
              </FarmhandContext.Provider>
            </SnackbarProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </GlobalHotKeys>
    )
  }
}

Farmhand.propTypes = {
  features: object,
  history: object,
  location: object,
  match: object.isRequired,
}
