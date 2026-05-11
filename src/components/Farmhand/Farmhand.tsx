import HotelIcon from '@mui/icons-material/Hotel.js'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft.js'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight.js'
import MenuIcon from '@mui/icons-material/Menu.js'
import Drawer from '@mui/material/Drawer/index.js'
import Fab from '@mui/material/Fab/index.js'
import MobileStepper from '@mui/material/MobileStepper/index.js'
import {
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import { joinRoom } from '@trystero-p2p/torrent'
import classNames from 'classnames'
import window from 'global/window.js'
import localforage from 'localforage'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import { SnackbarProvider } from 'notistack'
import { object } from 'prop-types'
import { GlobalHotKeys } from 'react-hotkeys'
import { Redirect } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import * as reducers from '../../game-logic/reducers/index.js'
import {
  handleCowTradeRequest,
  handleCowTradeRequestAccept,
  handleCowTradeRequestReject,
  handlePeerMetadataRequest,
} from '../../handlers/peer-events.js'
import eventHandlers from '../../handlers/ui-events.js'

import { endpoints, features, relayUrls, rtcConfig } from '../../config.js'
import {
  COW_TRADE_TIMEOUT,
  DEFAULT_ROOM,
  HEARTBEAT_INTERVAL_PERIOD,
  INITIAL_STORAGE_LIMIT,
  STAGE_TITLE_MAP,
  STANDARD_LOAN_AMOUNT,
  STANDARD_VIEW_LIST,
  Z_INDEX,
} from '../../constants.js'
import { scarecrow } from '../../data/items.js'
import { itemsMap, recipesMap } from '../../data/maps.js'
import {
  dialogView,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../../enums.js'
import { getData, postData } from '../../fetch-utils.js'
import theme from '../../mui-theme.js'
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
import {
  CONNECTED_TO_ROOM,
  LOAN_INCREASED,
  POSITIONS_POSTED_NOTIFICATION,
  RECIPE_LEARNED,
  RECIPES_LEARNED,
} from '../../templates.js'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements.js'
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
import { levelAchieved } from '../../utils/levelAchieved.js'
import { memoize } from '../../utils/memoize.js'
import { noop } from '../../utils/noop.js'

// NOTE: This must be imported here so that it can be overridden by component
// styles. The newlines before and after are intentional to prevent imports
// from being automatically reordered in a way that would break styles.
import './Farmhand.sass'

import AppBar from '../AppBar/index.js'
import { ChatRoom } from '../ChatRoom/index.js'
import ContextPane from '../ContextPane/index.js'
import Navigation from '../Navigation/index.js'
import NotificationSystem, {
  snackbarProviderContentCallback,
} from '../NotificationSystem/index.js'
import Stage from '../Stage/index.js'
import UpdateNotifier from '../UpdateNotifier/index.js'

import FarmhandContext, { BoundHandlers } from './Farmhand.context.js'
import { FarmhandReducers } from './FarmhandReducers.js'
import { getInventoryQuantities } from './helpers/getInventoryQuantities.js'

const { CLEANUP, HARVEST, MINE, OBSERVE, WATER, PLANT } = fieldMode

// Utility object for reuse in no-ops to save on memory
const emptyObject = Object.freeze({})

export const computePlayerInventory = memoize(
  /**
   * @param {{ id: globalThis.farmhand.item['id'], quantity: number }[]} inventory
   * @param {Record<string, number>} valueAdjustments
   * @returns {globalThis.farmhand.item[]}
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
   * @param {globalThis.farmhand.state['inventory']} inventory
   * @returns {globalThis.farmhand.item[]}
   */
  inventory =>
    inventory
      .filter(({ id }) => {
        const { enablesFieldMode } = itemsMap[id]

        return (
          typeof enablesFieldMode === 'string' && enablesFieldMode !== PLANT
        )
      })
      .map(({ id, quantity }) => ({ ...itemsMap[id], quantity }))
)

export const getPlantableCropInventory = memoize(
  /**
   * @param {globalThis.farmhand.state['inventory']} inventory
   * @returns {globalThis.farmhand.item[]}
   */
  inventory =>
    inventory
      .filter(({ id }) => itemsMap[id].isPlantableCrop)
      .map(({ id, quantity }) => ({ ...itemsMap[id], quantity }))
)

/**
 * @param {Record<string, number>} valueAdjustments
 * @param {Partial<Record<string, globalThis.farmhand.priceEvent>>} priceCrashes
 * @param {Partial<Record<string, globalThis.farmhand.priceEvent>>} priceSurges
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

export default class Farmhand extends FarmhandReducers {
  /*!
   * @member farmhand.Farmhand#state
   * @type {farmhand.state}
   */
  state: farmhand.state = this.createInitialState()

  handlers: BoundHandlers<typeof eventHandlers> & {
    debounced: BoundHandlers<typeof eventHandlers>
  } = {
    ...eventHandlers,
    debounced: { ...eventHandlers },
  } as BoundHandlers<typeof eventHandlers> & {
    debounced: BoundHandlers<typeof eventHandlers>
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
    const viewList: farmhand.stageFocusType[] = [...STANDARD_VIEW_LIST]

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
   * @returns
   */
  createInitialState(): farmhand.state {
    return {
      activePlayers: null,
      allowCustomPeerCowNames: false,
      cellarInventory: [],
      currentDialogView: dialogView.NONE as farmhand.dialogView,
      completedAchievements: {},
      cowForSale: generateCow() as farmhand.cow,
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
      fieldMode: OBSERVE as farmhand.fieldMode,
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
      playerId: uuid(),
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
      isOnline: this.props.match?.path.startsWith('/online') ?? false,
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
      room: decodeURIComponent(this.props.match?.params.room || DEFAULT_ROOM),
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
      stageFocus: stageFocusType.HOME as farmhand.stageFocusType,
      todaysNotifications: [],
      todaysLosses: 0,
      todaysPurchases: {},
      todaysRevenue: 0,
      todaysStartingInventory: {},
      toolLevels: {
        [toolType.HOE as farmhand.toolType]: toolLevel.DEFAULT as farmhand.toolLevel,
        [toolType.SCYTHE as farmhand.toolType]: toolLevel.DEFAULT as farmhand.toolLevel,
        [toolType.SHOVEL as farmhand.toolType]: toolLevel.UNAVAILABLE as farmhand.toolLevel,
        [toolType.WATERING_CAN as farmhand.toolType]: toolLevel.DEFAULT as farmhand.toolLevel,
      } as Record<farmhand.toolType, farmhand.toolLevel>,
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

    this.showNotification(LOAN_INCREASED('', STANDARD_LOAN_AMOUNT), 'info')
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
      selectHoe: () =>
        this.handlers.handleFieldModeSelect(
          /** @type {globalThis.farmhand.fieldMode} */ CLEANUP
        ),
      selectScythe: () =>
        this.handlers.handleFieldModeSelect(
          /** @type {globalThis.farmhand.fieldMode} */ HARVEST
        ),
      selectWateringCan: () =>
        this.handlers.handleFieldModeSelect(
          /** @type {globalThis.farmhand.fieldMode} */ WATER
        ),
      selectShovel: () => {
        if (this.state.toolLevels[toolType.SHOVEL] !== toolLevel.UNAVAILABLE) {
          this.handlers.handleFieldModeSelect(
            /** @type {globalThis.farmhand.fieldMode} */ MINE
          )
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
    const state = await this.props.localforage?.getItem('state')

    if (state) {
      const sanitizedState = transformStateDataForImport({
        ...this.createInitialState(),
        // eslint-disable-next-line
        .../** @type {Partial<farmhand.state>} */ state,
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

        const [sendPeerMetadata, getPeerMetadataFunc] = peerRoom.makeAction(
          'peerMetadata'
        )

        getPeerMetadataFunc((
          /** @type {[object, string]} */
          ...args
        ) => handlePeerMetadataRequest(this, args[0], args[1]))

        const [sendCowTradeRequest, getCowTradeRequest] = peerRoom.makeAction(
          'cowTrade'
        )

        getCowTradeRequest((
          /** @type {[object, string]} */
          ...args
        ) => handleCowTradeRequest(this, args[0], args[1]))

        const [sendCowAccept, getCowAccept] = peerRoom.makeAction('cowAccept')

        getCowAccept((
          /** @type {[object, string]} */
          ...args
        ) => handleCowTradeRequestAccept(this, args[0], args[1]))

        const [sendCowReject, getCowReject] = peerRoom.makeAction('cowReject')

        getCowReject((
          /** @type {[object]} */
          ...args
        ) => handleCowTradeRequestReject(this, args[0]))

        this.setState({
          getCowAccept,
          getCowReject,
          getCowTradeRequest,
          getPeerMetadata: getPeerMetadataFunc,
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
   * @param {globalThis.farmhand.cow} peerPlayerCow
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
        Object.entries(peers).find(([, peer]) => peer?.playerId === ownerId) ??
        []

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
    await this.props.localforage?.clear()

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
        farmId: this.state.playerId,
        room: room,
      })

      this.scheduleHeartbeat()

      const relayRedundancy = 4

      this.setState({
        activePlayers: 1,
        peerRoom: joinRoom(
          {
            appId: import.meta.env?.VITE_NAME,
            rtcConfig,
            ...(relayUrls && {
              relayConfig: {
                urls: relayUrls,
                redundancy: relayRedundancy,
              },
            }),
          },
          room
        ),
        valueAdjustments: applyPriceEvents(
          valueAdjustments,
          priceCrashes,
          priceSurges
        ),
      })

      this.showNotification(CONNECTED_TO_ROOM('', room), 'success')
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
      heartbeatTimeoutId: (window.setTimeout(async () => {
        this.setState(({ money, activePlayers }) => ({
          activePlayers,
          money: moneyTotal(money, activePlayers),
        }))

        this.scheduleHeartbeat()
      }, HEARTBEAT_INTERVAL_PERIOD) as unknown) as number,
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
    let learnedRecipes: farmhand.recipe[] = []

    Object.keys(this.state.learnedRecipes).forEach(recipeId => {
      if (!previousLearnedRecipes.hasOwnProperty(recipeId)) {
        learnedRecipes.push(recipesMap[recipeId])
      }
    })

    if (learnedRecipes.length > 1) {
      this.showNotification(RECIPES_LEARNED('', learnedRecipes))
    } else if (learnedRecipes.length === 1) {
      this.showNotification(RECIPE_LEARNED('', learnedRecipes[0]))
    }
  }

  /*!
   * @param {Object} [overrides] Data to patch into this.state when persisting.
   * @return {Promise}
   */
  persistState(overrides = {}) {
    return this.props.localforage?.setItem(
      'state',
      reduceByPersistedKeys({
        ...this.state,
        ...overrides,
      })
    )
  }

  async updateServerForNextDay() {
    /** @type  */
    const serverMessages: { message: string; severity: string }[] = []

    /**
     * @type
     */
    let broadcastedPositionMessage: string | null = null

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
            message: POSITIONS_POSTED_NOTIFICATION('', 'You', positions),
            severity: 'info',
          })

          broadcastedPositionMessage = POSITIONS_POSTED_NOTIFICATION(
            '',
            '',
            positions
          )
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

    /** @type  */
    let pendingNotifications: { message: string; severity: string }[] = []

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
   * @param {farmhand.module:enums.dialogView} dialogViewName
   */
  openDialogView(dialogViewName) {
    this.setState({ currentDialogView: dialogViewName, isDialogViewOpen: true })
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

  messagePeers(message: string, severity?: string) {
    this.prependPendingPeerMessage(message, severity)
  }

  render() {
    const {
      props: { features: propsFeatures },
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
      features: propsFeatures ?? {},
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
              <FarmhandContext.Provider
                value={{
                  gameState,
                  handlers,
                }}
              >
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

  static propTypes = {
    features: object,
    history: object,
    location: object,
    match: object.isRequired,
  }
}
