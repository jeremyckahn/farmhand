import React, { Component } from 'react'
import window from 'global/window'
import { Redirect } from 'react-router-dom'
import { GlobalHotKeys } from 'react-hotkeys'
import localforage from 'localforage'
import { v4 as uuid } from 'uuid'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
import MenuIcon from '@material-ui/icons/Menu'
import HotelIcon from '@material-ui/icons/Hotel'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Tooltip from '@material-ui/core/Tooltip'
import MobileStepper from '@material-ui/core/MobileStepper'
import { SnackbarProvider } from 'notistack'
import debounce from 'lodash.debounce'
import classNames from 'classnames'

import FarmhandContext from './Farmhand.context'
import eventHandlers from './event-handlers'
import * as reducers from './reducers'
// This must be imported here so that it can be overridden by component styles.
import './Farmhand.sass'

import AppBar from './components/AppBar'
import Navigation from './components/Navigation'
import ContextPane from './components/ContextPane'
import Stage from './components/Stage'
import NotificationSystem, {
  snackbarProviderContentCallback,
} from './components/NotificationSystem'
import DebugMenu from './components/DebugMenu'
import theme from './mui-theme'
import {
  computeMarketPositions,
  createNewField,
  doesMenuObstructStage,
  farmProductsSold,
  getAvailbleShopInventory,
  getItemCurrentValue,
  getLevelEntitlements,
  levelAchieved,
  memoize,
  moneyTotal,
  nullArray,
  reduceByPersistedKeys,
  sanitizeStateForImport,
} from './utils'
import { getData, postData } from './fetch-utils'
import { itemsMap, recipesMap } from './data/maps'
import { dialogView, fieldMode, stageFocusType } from './enums'
import {
  DEFAULT_ROOM,
  INITIAL_INVENTORY_LIMIT,
  PURCHASEABLE_COW_PENS,
  STAGE_TITLE_MAP,
  STANDARD_LOAN_AMOUNT,
} from './constants'
import { HEARTBEAT_INTERVAL_PERIOD } from './common/constants'
import {
  CONNECTED_TO_ROOM,
  COW_PEN_PURCHASED,
  LOAN_INCREASED,
  POSITIONS_POSTED_NOTIFICATION,
  RECIPE_LEARNED,
} from './templates'
import {
  DATA_DELETED,
  CONNECTING_TO_SERVER,
  DISCONNECTED_FROM_SERVER,
  PROGRESS_SAVED_MESSAGE,
  SERVER_ERROR,
  UPDATE_AVAILABLE,
} from './strings'
import { endpoints } from './config'

const { CLEANUP, HARVEST, OBSERVE, WATER } = fieldMode

const itemIds = Object.freeze(Object.keys(itemsMap))

/*!
 * @param {Array.<{ id: farmhand.item, quantity: number }>} inventory
 * @param {Object.<number>} valueAdjustments
 * @returns {Array.<farmhand.item>}
 */
export const computePlayerInventory = memoize((inventory, valueAdjustments) =>
  inventory.map(({ quantity, id }) => ({
    quantity,
    ...itemsMap[id],
    value: getItemCurrentValue(itemsMap[id], valueAdjustments),
  }))
)

/*!
 * @param {Array.<{ id: farmhand.item }>} inventory
 * @returns {Array.<{ id: farmhand.item }>}
 */
export const getFieldToolInventory = memoize(inventory =>
  inventory
    .filter(({ id }) => {
      const { enablesFieldMode } = itemsMap[id]

      return (
        typeof enablesFieldMode === 'string' &&
        enablesFieldMode !== fieldMode.PLANT
      )
    })
    .map(({ id }) => itemsMap[id])
)

/*!
 * @param {Array.<{ id: farmhand.item }>} inventory
 * @returns {Array.<{ id: farmhand.item }>}
 */
export const getPlantableCropInventory = memoize(inventory =>
  inventory
    .filter(({ id }) => itemsMap[id].isPlantableCrop)
    .map(({ id }) => itemsMap[id])
)

/**
 * @param {Object.<number>} valueAdjustments
 * @param {farmhand.priceEvent} priceCrashes
 * @param {farmhand.priceEvent} priceSurges
 * @returns {Object.<number>}
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
 * @property {farmhand.module:enums.dialogView} currentDialogView
 * @property {Object.<string, boolean>} completedAchievements Keys are
 * achievement ids.
 * @property {farmhand.cow} cowForSale
 * @property {Array.<farmhand.cowBreedingPen>} cowBreedingPen
 * @property {Array.<farmhand.cow>} cowInventory
 * @property {Object.<farmhand.module:enums.cowColors, number>}
 * cowColorsPurchased Keys are color enums, values are the number of that color
 * of cow purchased.
 * @property {Object} cowsSold Keys are items IDs, values are the id references
 * of cow colors (rainbow-cow, etc.).
 * @property {Object.<farmhand.module:enums.cropType, number>} cropsHarvested A
 * map of totals of crops harvested. Keys are crop type IDs, values are the
 * number of that crop harvested.
 * @property {number} dayCount
 * @property {Array.<Array.<?farmhand.plotContent>>} field
 * @property {farmhand.module:enums.fieldMode} fieldMode
 * @property {number?} heartbeatTimeoutId
 * @property {Array.<number>} historicalDailyLosses
 * @property {Array.<number>} historicalDailyRevenue
 * @property {Array.<Object.<number>>} historicalValueAdjustments Currently
 * there is only one element in this array, but it will be used for more
 * historical price data analysis in the future. It is an array for
 * future-facing flexibility.
 * @property {number} hoveredPlotRangeSize
 * @property {string} id
 * @property {Array.<{ id: farmhand.item, quantity: number }>} inventory
 * @property {number} inventoryLimit Is -1 if inventory is unlimited.
 * @property {boolean} isAwaitingNetworkRequest
 * @property {boolean} isMenuOpen
 * @property {Object} itemsSold Keys are items IDs, values are the number of
 * that item sold.
 * @property {boolean} isDialogViewOpen
 * @property {boolean} isOnline Whether the player is playing online.
 * @property {Object} learnedRecipes Keys are recipe IDs, values are `true`.
 * @property {number} loanBalance
 * @property {number} loansTakenOut
 * @property {number} money
 * @property {farmhand.notification} latestNotification
 * @property {Array.<farmhand.notification>} newDayNotifications
 * @property {Array.<farmhand.notification>} notificationLog
 * @property {string} selectedCowId
 * @property {string} selectedItemId
 * @property {Object.<string, farmhand.priceEvent>} priceCrashes Keys are
 * itemIds.
 * @property {Object.<string, farmhand.priceEvent>} priceSurges Keys are
 * itemIds.
 * @property {number} purchasedCowPen
 * @property {number} purchasedField
 * @property {number} profitabilityStreak
 * @property {number} record7dayProfitAverage
 * @property {number} recordProfitabilityStreak
 * @property {number} recordSingleDayProfit
 * @property {number} revenue The amount of money the player has generated in
 * @property {string} redirect Transient value used to drive router redirection.
 * @property {string} room What online room the player is in.
 * @property {farmhand.module:enums.stageFocusType} stageFocus
 * @property {Array.<farmhand.notification>} todaysNotifications
 * @property {number} todaysLosses Should always be a negative number.
 * @property {Object} todaysPurchases Keys are item names, values are their
 * respective quantities.
 * @property {number} todaysRevenue Should always be a positive number.
 * @property {Object} todaysStartingInventory Keys are item names, values are
 * their respective quantities.
 * @property {boolean} useAlternateEndDayButtonPosition Option to display the
 * Bed button on the left side of the screen.
 * @property {Object.<number>} valueAdjustments
 * @property {string} version Comes from the `version` property in
 * package.json.
 */

export default class Farmhand extends Component {
  // Bind event handlers

  localforage = localforage.createInstance({
    name: 'farmhand',
    description: 'Persisted game data for Farmhand',
  })

  /*!
   * @member farmhand.Farmhand#state
   * @type {farmhand.state}
   */
  state = {
    activePlayers: null,
    currentDialogView: dialogView.NONE,
    completedAchievements: {},
    cowForSale: {},
    cowBreedingPen: {
      cowId1: null,
      cowId2: null,
      daysUntilBirth: -1,
    },
    cowInventory: [],
    cowColorsPurchased: {},
    cowsSold: {},
    cropsHarvested: {},
    dayCount: 0,
    farmName: 'Unnamed',
    field: createNewField(),
    hasBooted: false,
    heartbeatTimeoutId: null,
    historicalDailyLosses: [],
    historicalDailyRevenue: [],
    historicalValueAdjustments: [],
    hoveredPlotRangeSize: 0,
    id: uuid(),
    inventory: [],
    inventoryLimit: INITIAL_INVENTORY_LIMIT,
    isAwaitingNetworkRequest: false,
    isMenuOpen: !doesMenuObstructStage(),
    itemsSold: {},
    isDialogViewOpen: false,
    isOnline: this.props.match.path.startsWith('/online'),
    learnedRecipes: {},
    loanBalance: STANDARD_LOAN_AMOUNT,
    loansTakenOut: 1,
    money: STANDARD_LOAN_AMOUNT,
    latestNotification: null,
    newDayNotifications: [],
    notificationLog: [],
    selectedCowId: '',
    selectedItemId: '',
    fieldMode: OBSERVE,
    priceCrashes: {},
    priceSurges: {},
    profitabilityStreak: 0,
    record7dayProfitAverage: 0,
    recordProfitabilityStreak: 0,
    recordSingleDayProfit: 0,
    revenue: 0,
    redirect: '',
    room: decodeURIComponent(this.props.match.params.room || DEFAULT_ROOM),
    purchasedCowPen: 0,
    purchasedField: 0,
    stageFocus: stageFocusType.HOME,
    todaysNotifications: [],
    todaysLosses: 0,
    todaysPurchases: {},
    todaysRevenue: 0,
    todaysStartingInventory: {},
    useAlternateEndDayButtonPosition: false,
    valueAdjustments: {},
    version: process.env.REACT_APP_VERSION,
  }

  constructor() {
    super(...arguments)

    this.initInputHandlers()
    this.initReducers()

    // This is antipattern, but it's useful for debugging. The Farmhand
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

  get playerInventoryQuantities() {
    const { inventory } = this.state

    return itemIds.reduce((acc, itemId) => {
      const itemInInventory = inventory.find(({ id }) => id === itemId)
      acc[itemId] = itemInInventory ? itemInInventory.quantity : 0

      return acc
    }, {})
  }

  get plantableCropInventory() {
    return getPlantableCropInventory(this.state.inventory)
  }

  get viewList() {
    const { COW_PEN, FIELD, HOME, WORKSHOP, SHOP } = stageFocusType
    const viewList = [HOME, SHOP, FIELD]

    if (this.state.purchasedCowPen) {
      viewList.push(COW_PEN)
    }

    viewList.push(WORKSHOP)

    return viewList
  }

  get levelEntitlements() {
    return getLevelEntitlements(
      levelAchieved(farmProductsSold(this.state.itemsSold))
    )
  }

  get shopInventory() {
    return getAvailbleShopInventory(this.levelEntitlements)
  }

  initInputHandlers() {
    const debouncedInputRate = 50

    this.handlers = { debounced: {} }

    Object.keys(eventHandlers).forEach(method => {
      this.handlers[method] = eventHandlers[method].bind(this)

      this.handlers.debounced[method] = debounce(
        this.handlers[method],
        debouncedInputRate
      )
    })

    // The dialog view mappings here must be kept in sync with the
    // dialogTriggerTextMap map in Navigation.js.
    this.keyMap = {
      incrementDay: 'shift+c',
      nextView: 'right',
      openAccounting: 'b',
      openAchievements: 'a',
      openLog: 'l',
      openPriceEvents: 'e',
      openStats: 's',
      openSettings: ',',
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
      previousView: this.focusPreviousView.bind(this),
      selectHoe: () => this.handlers.handleFieldModeSelect(CLEANUP),
      selectScythe: () => this.handlers.handleFieldModeSelect(HARVEST),
      selectWateringCan: () => this.handlers.handleFieldModeSelect(WATER),
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

    if (process.env.NODE_ENV === 'development') {
      Object.assign(this.keyMap, {
        clearPersistedData: 'shift+d',
        waterAllPlots: 'w',
      })
    }

    Object.assign(this.keyHandlers, {
      clearPersistedData: () => this.clearPersistedData(),
      waterAllPlots: () => this.waterAllPlots(this.state),
    })
  }

  initReducers() {
    ;[
      'adjustLoan',
      'computeStateForNextDay',
      'changeCowAutomaticHugState',
      'changeCowBreedingPenResident',
      'changeCowName',
      'clearPlot',
      'fertilizeCrop',
      'forRange',
      'harvestPlot',
      'hugCow',
      'makeRecipe',
      'modifyCow',
      'purchaseCow',
      'purchaseCowPen',
      'purchaseField',
      'purchaseItem',
      'purchaseStorageExpansion',
      'plantInPlot',
      'sellItem',
      'sellCow',
      'selectCow',
      'setScarecrow',
      'setSprinkler',
      'showNotification',
      'waterField',
      'waterAllPlots',
      'waterPlot',
    ].forEach(reducerName => {
      const reducer = reducers[reducerName]

      this[reducerName] = (...args) => {
        this.setState(state => reducer(state, ...args))
      }
    })
  }

  componentDidMount() {
    this.localforage.getItem('state').then(state => {
      if (state) {
        const sanitizedState = sanitizeStateForImport(state)
        const { newDayNotifications } = sanitizedState

        this.setState({ ...sanitizedState, newDayNotifications: [] }, () => {
          newDayNotifications.forEach(({ message, severity }) =>
            this.showNotification(message, severity)
          )
        })
      } else {
        // Initialize new game
        this.incrementDay(true)
        this.setState(() => ({ historicalValueAdjustments: [] }))
        this.showNotification(LOAN_INCREASED`${STANDARD_LOAN_AMOUNT}`, 'info')
      }

      this.syncToRoom()

      this.setState({ hasBooted: true })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      hasBooted,
      heartbeatTimeoutId,
      isMenuOpen,
      isOnline,
      money,
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

    const newIsOnline = path.startsWith('/online')

    if (newIsOnline !== this.state.isOnline || decodedRoom !== room) {
      this.setState(() => ({
        isOnline: newIsOnline,
        redirect: '',
        room: decodedRoom,
      }))
    }

    if (isOnline !== prevState.isOnline || room !== prevState.room) {
      this.syncToRoom()

      if (!isOnline) {
        clearTimeout(heartbeatTimeoutId)
        this.setState({ activePlayers: null, heartbeatTimeoutId: null })
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

    ;[
      'showCowPenPurchasedNotifications',
      'showRecipeLearnedNotifications',
    ].forEach(fn => this[fn](prevState))
  }

  clearPersistedData() {
    this.localforage.clear().then(() => this.showNotification(DATA_DELETED))
  }

  async syncToRoom() {
    const { isOnline, priceCrashes, priceSurges, room } = this.state

    if (!isOnline) {
      return
    }

    this.showNotification(CONNECTING_TO_SERVER, 'info')

    try {
      this.setState({ isAwaitingNetworkRequest: true })

      const { activePlayers, valueAdjustments } = await getData(
        endpoints.getMarketData,
        {
          farmId: this.state.id,
          room: room,
        }
      )

      this.scheduleHeartbeat()

      this.setState({
        activePlayers,
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
    }

    this.setState({ isAwaitingNetworkRequest: false })
  }

  scheduleHeartbeat() {
    const { heartbeatTimeoutId, id, room } = this.state
    clearTimeout(heartbeatTimeoutId)

    this.setState(() => ({
      heartbeatTimeoutId: setTimeout(async () => {
        try {
          const { activePlayers } = await getData(endpoints.getMarketData, {
            farmId: id,
            room,
          })

          this.setState({ activePlayers })
        } catch (e) {
          this.showNotification(SERVER_ERROR, 'error')

          console.error(e)
        }

        this.scheduleHeartbeat()
      }, HEARTBEAT_INTERVAL_PERIOD),
    }))
  }

  /*!
   * @param {farmhand.state} prevState
   */
  showCowPenPurchasedNotifications(prevState) {
    const {
      state: { purchasedCowPen },
    } = this

    if (purchasedCowPen !== prevState.purchasedCowPen) {
      const { cows } = PURCHASEABLE_COW_PENS.get(purchasedCowPen)

      this.showNotification(COW_PEN_PURCHASED`${cows}`)
    }
  }

  /*!
   * @param {farmhand.state} prevState
   */
  showRecipeLearnedNotifications({ learnedRecipes: previousLearnedRecipes }) {
    Object.keys(this.state.learnedRecipes).forEach(recipeId => {
      if (!previousLearnedRecipes.hasOwnProperty(recipeId)) {
        this.showNotification(RECIPE_LEARNED`${recipesMap[recipeId]}`)
      }
    })
  }

  /*!
   * @param {Object} [overrides] Data to patch into this.state when persisting.
   * @return {Promise}
   */
  persistState(overrides = {}) {
    return this.localforage.setItem(
      'state',
      reduceByPersistedKeys({
        ...this.state,
        ...overrides,
      })
    )
  }

  /*!
   * @param {boolean} [isFirstDay=false]
   */
  async incrementDay(isFirstDay = false) {
    const {
      inventory,
      isOnline,
      room,
      todaysPurchases,
      todaysStartingInventory,
    } = this.state
    const nextDayState = reducers.computeStateForNextDay(this.state, isFirstDay)
    const serverMessages = []

    if (isOnline) {
      try {
        this.setState({ isAwaitingNetworkRequest: true })

        const positions = computeMarketPositions(
          todaysStartingInventory,
          todaysPurchases,
          inventory
        )

        if (Object.keys(positions).length) {
          serverMessages.push({
            message: POSITIONS_POSTED_NOTIFICATION`${positions}`,
            severity: 'info',
          })
        }

        const { valueAdjustments } = await postData(endpoints.postDayResults, {
          positions,
          room,
        })

        nextDayState.valueAdjustments = applyPriceEvents(
          valueAdjustments,
          nextDayState.priceCrashes,
          nextDayState.priceSurges
        )
      } catch (e) {
        serverMessages.push({
          message: SERVER_ERROR,
          severity: 'error',
        })

        console.error(e)
      }

      this.setState({ isAwaitingNetworkRequest: false })
    }

    const pendingNotifications = [
      ...serverMessages,
      ...nextDayState.newDayNotifications,
    ]

    // This would be cleaner if setState was called after localForage.setItem,
    // but updating the state first makes for a more responsive user
    // experience. The persisted state is computed post-update and stored
    // asynchronously, thus avoiding state changes from being blocked.

    this.setState(
      { ...nextDayState, newDayNotifications: [], todaysNotifications: [] },
      async () => {
        try {
          await this.persistState({
            // Old pendingNotifications are persisted so that they can be
            // shown to the player when the app reloads.
            newDayNotifications: pendingNotifications,
          })
          ;[]
            .concat(pendingNotifications)
            .concat(
              isFirstDay
                ? []
                : [{ message: PROGRESS_SAVED_MESSAGE, severity: 'info' }]
            )
            .forEach(({ message, severity }) =>
              this.showNotification(message, severity)
            )
        } catch (e) {
          console.error(e)

          this.showNotification(JSON.stringify(e), 'error')
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
    const { viewList } = this

    this.setState(({ stageFocus }) => {
      const currentViewIndex = viewList.indexOf(stageFocus)

      return { stageFocus: viewList[(currentViewIndex + 1) % viewList.length] }
    })
  }

  focusPreviousView() {
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

  /*!
   * @param {ServiceWorkerRegistration} registration
   */
  showUpdateNotification(registration) {
    // @see https://github.com/jeremyckahn/farmhand/blob/dd1dd502b079be39f50c7d62a54a2027ba83360c/src/service-worker.js#L65-L71
    // @see https://github.com/pwa-builder/pwa-update/blob/1b709e339e1bde6b13cc71eb4812618d2d28fd54/src/pwa-update.ts#L169-L171
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })

    this.showNotification(UPDATE_AVAILABLE, 'success', () => {
      window.location.reload()
    })
  }

  render() {
    const {
      state: { redirect },
      fieldToolInventory,
      handlers,
      keyHandlers,
      keyMap,
      levelEntitlements,
      plantableCropInventory,
      playerInventory,
      playerInventoryQuantities,
      shopInventory,
      viewList,
      viewTitle,
    } = this

    // Bundle up the raw state and the computed state into one object to be
    // passed down through the component tree.
    const gameState = {
      ...this.state,
      fieldToolInventory,
      levelEntitlements,
      plantableCropInventory,
      playerInventory,
      playerInventoryQuantities,
      shopInventory,
      viewList,
      viewTitle,
    }

    return (
      <GlobalHotKeys keyMap={keyMap} handlers={keyHandlers}>
        <MuiThemeProvider theme={theme}>
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
                  className: classNames('Farmhand fill', {
                    'use-alternate-end-day-button-position': this.state
                      .useAlternateEndDayButtonPosition,
                    'block-input': this.state.isAwaitingNetworkRequest,
                  }),
                }}
              >
                <AppBar />
                <Drawer
                  {...{
                    className: 'sidebar-wrapper',
                    open: gameState.isMenuOpen,
                    variant: 'persistent',
                    PaperProps: {
                      className: 'sidebar',
                    },
                  }}
                >
                  <Navigation />
                  <ContextPane />
                  {process.env.NODE_ENV === 'development' && <DebugMenu />}
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
                      color: 'secondary',
                      onClick: handlers.handleClickEndDayButton,
                    }}
                  >
                    <HotelIcon />
                  </Fab>
                </Tooltip>
              </div>
              <NotificationSystem />
            </FarmhandContext.Provider>
          </SnackbarProvider>
        </MuiThemeProvider>
      </GlobalHotKeys>
    )
  }
}
