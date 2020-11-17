import React, { Component } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import localforage from 'localforage'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
import MenuIcon from '@material-ui/icons/Menu'
import HotelIcon from '@material-ui/icons/Hotel'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Tooltip from '@material-ui/core/Tooltip'
import MobileStepper from '@material-ui/core/MobileStepper'
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
import NotificationSystem from './components/NotificationSystem'
import DebugMenu from './components/DebugMenu'
import theme from './mui-theme'
import {
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
} from './utils'
import { itemsMap, recipesMap } from './data/maps'
import { dialogView, fieldMode, stageFocusType } from './enums'
import {
  INITIAL_INVENTORY_LIMIT,
  PURCHASEABLE_COW_PENS,
  STAGE_TITLE_MAP,
  STANDARD_LOAN_AMOUNT,
} from './constants'
import { COW_PEN_PURCHASED, LOAN_INCREASED, RECIPE_LEARNED } from './templates'
import {
  DATA_DELETED,
  PROGRESS_SAVED_MESSAGE,
  UPDATE_AVAILABLE,
} from './strings'

const { CLEANUP, HARVEST, OBSERVE, WATER } = fieldMode

const itemIds = Object.freeze(Object.keys(itemsMap))

/**
 * @param {Array.<{ item: farmhand.item, quantity: number }>} inventory
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

/**
 * @param {Array.<{ item: farmhand.item }>} inventory
 * @returns {Array.<{ item: farmhand.item }>}
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

/**
 * @param {Array.<{ item: farmhand.item }>} inventory
 * @returns {Array.<{ item: farmhand.item }>}
 */
export const getPlantableCropInventory = memoize(inventory =>
  inventory
    .filter(({ id }) => itemsMap[id].isPlantableCrop)
    .map(({ id }) => itemsMap[id])
)

/**
 * @typedef farmhand.state
 * @type {Object}
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
 * @property {Array.<number>} historicalDailyLosses
 * @property {Array.<number>} historicalDailyRevenue
 * @property {Array.<Object.<number>>} historicalValueAdjustments Currently
 * there is only one element in this array, but it will be used for more
 * historical price data analysis in the future. It is an array for
 * future-facing flexibility.
 * @property {number} hoveredPlotRangeSize
 * @property {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @property {number} inventoryLimit Is -1 if inventory is unlimited.
 * @property {boolean} isMenuOpen
 * @property {Object} itemsSold Keys are items IDs, values are the number of
 * that item sold.
 * @property {boolean} isDialogViewOpen
 * @property {Object} learnedRecipes Keys are recipe IDs, values are `true`.
 * @property {number} loanBalance
 * @property {number} money
 * @property {Array.<farmhand.notification>} newDayNotifications
 * @property {Array.<farmhand.notification>} notifications
 * @property {Array.<farmhand.notification} notificationLog
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
 * @property {number} revenue The amount of money the player has generated in
 * revenue.
 * @property {boolean} doShowNotifications
 * @property {farmhand.module:enums.stageFocusType} stageFocus
 * @property {Array.<farmhand.notification>} todaysPastNotifications
 * @property {number} todaysLosses Should always be a negative number.
 * @property {number} todaysRevenue Should always be a positive number.
 * @property {Object.<number>} valueAdjustments
 */

export default class Farmhand extends Component {
  // Bind event handlers

  localforage = localforage.createInstance({
    name: 'farmhand',
    description: 'Persisted game data for Farmhand',
  })

  /**
   * @member farmhand.Farmhand#state
   * @type {farmhand.state}
   */
  state = {
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
    historicalDailyLosses: [],
    historicalDailyRevenue: [],
    historicalValueAdjustments: [],
    hoveredPlotRangeSize: 0,
    inventory: [],
    inventoryLimit: INITIAL_INVENTORY_LIMIT,
    isMenuOpen: !doesMenuObstructStage(),
    itemsSold: {},
    isDialogViewOpen: false,
    learnedRecipes: {},
    loanBalance: STANDARD_LOAN_AMOUNT,
    money: STANDARD_LOAN_AMOUNT,
    newDayNotifications: [],
    notifications: [],
    notificationLog: [],
    selectedCowId: '',
    selectedItemId: '',
    fieldMode: OBSERVE,
    priceCrashes: {},
    priceSurges: {},
    profitabilityStreak: 0,
    record7dayProfitAverage: 0,
    recordProfitabilityStreak: 0,
    revenue: 0,
    purchasedCowPen: 0,
    purchasedField: 0,
    doShowNotifications: false,
    stageFocus: stageFocusType.HOME,
    todaysPastNotifications: [],
    todaysLosses: 0,
    todaysRevenue: 0,
    valueAdjustments: {},
  }

  constructor() {
    super(...arguments)

    this.initInputHandlers()
    this.initReducers()
  }

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
        const { newDayNotifications } = state
        this.setState({ ...state, newDayNotifications: [] }, () => {
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

      this.setState({ hasBooted: true })
    })
  }

  componentDidUpdate(_prevProps, prevState) {
    const { hasBooted, money, stageFocus, isMenuOpen } = this.state

    // The operations after this if block concern transient gameplay state, but
    // componentDidUpdate runs as part of the rehydration/bootup process. So,
    // check to see if the app has completed booting before doing anything with
    // this transient state.
    if (!hasBooted) {
      return
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

  /**
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

  /**
   * @param {farmhand.state} prevState
   */
  showRecipeLearnedNotifications({ learnedRecipes: previousLearnedRecipes }) {
    Object.keys(this.state.learnedRecipes).forEach(recipeId => {
      if (!previousLearnedRecipes.hasOwnProperty(recipeId)) {
        this.showNotification(RECIPE_LEARNED`${recipesMap[recipeId]}`)
      }
    })
  }

  /**
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

  /**
   * @param {boolean} [isFirstDay=false]
   */
  incrementDay(isFirstDay = false) {
    const nextDayState = reducers.computeStateForNextDay(this.state, isFirstDay)
    const pendingNotifications = [...nextDayState.newDayNotifications]

    // This would be cleaner if setState was called after localForage.setItem,
    // but updating the state first makes for a more responsive user
    // experience. The persisted state is computed post-update and stored
    // asynchronously, thus avoiding state changes from being blocked.

    this.setState(
      { ...nextDayState, newDayNotifications: [], notifications: [] },
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

  /**
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

  showUpdateNotification() {
    this.showNotification(UPDATE_AVAILABLE, 'success')
  }

  render() {
    const {
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
          <FarmhandContext.Provider value={{ gameState, handlers }}>
            <div className="Farmhand fill">
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
                        End the day to save your progress and advance the game.
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
        </MuiThemeProvider>
      </GlobalHotKeys>
    )
  }
}
