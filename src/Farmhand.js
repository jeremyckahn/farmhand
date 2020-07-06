import React, { Component } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import memoize from 'fast-memoize'
import localforage from 'localforage'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
import HotelIcon from '@material-ui/icons/Hotel'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Tooltip from '@material-ui/core/Tooltip'
import debounce from 'lodash.debounce'

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
import { createNewField, doesMenuObstructStage, getItemValue } from './utils'
import shopInventory from './data/shop-inventory'
import { itemsMap, recipesMap } from './data/maps'
import { dialogView, fieldMode, stageFocusType } from './enums'
import { STANDARD_LOAN_AMOUNT, PURCHASEABLE_COW_PENS } from './constants'
import { COW_PEN_PURCHASED, LOAN_INCREASED, RECIPE_LEARNED } from './templates'
import { PROGRESS_SAVED_MESSAGE } from './strings'

const { CLEANUP, HARVEST, OBSERVE, WATER } = fieldMode

const itemIds = Object.freeze(Object.keys(itemsMap))

const stageTitleMap = {
  [stageFocusType.HOME]: 'Home',
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.SHOP]: 'Shop',
  [stageFocusType.COW_PEN]: 'Cows',
  [stageFocusType.KITCHEN]: 'Kitchen',
}

/**
 * @param {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @param {Object.<number>} valueAdjustments
 * @returns {Array.<farmhand.item>}
 */
export const computePlayerInventory = memoize((inventory, valueAdjustments) =>
  inventory.map(({ quantity, id }) => ({
    quantity,
    ...itemsMap[id],
    value: getItemValue(itemsMap[id], valueAdjustments),
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
 * @property {Array.<farmhand.cow>} cowInventory
 * @property {Object.<farmhand.module:enums.cowColors, number>}
 * cowColorsPurchased Keys are color enums, values are the number of that color
 * of cow purchased.
 * @property {Object.<farmhand.module:enums.cropType, number>} cropsHarvested A
 * map of totals of crops harvested. Keys are crop type IDs, values are the
 * number of that crop harvested.
 * @property {number} dayCount
 * @property {Array.<Array.<?farmhand.plotContent>>} field
 * @property {farmhand.module:enums.fieldMode} fieldMode
 * @property {number} hoveredPlotRangeSize
 * @property {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @property {boolean} isMenuOpen
 * @property {Object} itemsSold Keys are items IDs, values are the number of
 * that item sold.
 * @property {Object} learnedRecipes Keys are recipe IDs, values are `true`.
 * @property {number} loanBalance
 * @property {number} money
 * @property {Array.<string>} newDayNotifications
 * @property {Array.<string>} notifications
 * @property {Array.<string} notificationLog
 * @property {string} selectedCowId
 * @property {string} selectedItemId
 * @property {Object.<string, farmhand.priceEvent>} priceCrashes Keys are
 * itemIds.
 * @property {Object.<string, farmhand.priceEvent>} priceSurges Keys are
 * itemIds.
 * @property {number} purchasedCowPen
 * @property {number} purchasedField
 * @property {number} revenue The amount of money the player has generated in
 * revenue.
 * @property {Array.<farmhand.item>} shopInventory
 * @property {boolean} doShowNotifications
 * @property {farmhand.module:enums.stageFocusType} stageFocus
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
    cowInventory: [],
    cowColorsPurchased: {},
    cropsHarvested: {},
    dayCount: 0,
    field: createNewField(),
    hasBooted: false,
    hoveredPlotRangeSize: 0,
    inventory: [],
    isMenuOpen: !doesMenuObstructStage(),
    itemsSold: {},
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
    revenue: 0,
    purchasedCowPen: 0,
    purchasedField: 0,
    shopInventory: [...shopInventory],
    doShowNotifications: false,
    stageFocus: stageFocusType.HOME,
    valueAdjustments: {},
  }

  constructor() {
    super(...arguments)

    this.initInputHandlers()
    this.initReducers()
  }

  static reduceByPersistedKeys(state) {
    return [
      'cowForSale',
      'completedAchievements',
      'cowInventory',
      'cowColorsPurchased',
      'cropsHarvested',
      'dayCount',
      'field',
      'inventory',
      'itemsSold',
      'learnedRecipes',
      'loanBalance',
      'money',
      'newDayNotifications',
      'notificationLog',
      'purchasedCowPen',
      'purchasedField',
      'priceCrashes',
      'priceSurges',
      'revenue',
      'valueAdjustments',
    ].reduce((acc, key) => {
      acc[key] = state[key]

      return acc
    }, {})
  }

  get viewTitle() {
    return stageTitleMap[this.state.stageFocus]
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
    const { COW_PEN, FIELD, HOME, KITCHEN, SHOP } = stageFocusType

    const viewList = [HOME, FIELD, SHOP]

    if (this.state.purchasedCowPen) {
      viewList.push(COW_PEN)
    }

    viewList.push(KITCHEN)

    return viewList
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

    this.keyMap = {
      focusCows: 'c',
      focusField: 'f',
      focusHome: 'h',
      focusKitchen: 'k',
      focusShop: 's',
      incrementDay: 'shift+c',
      nextView: 'right',
      openAccounting: 'b',
      openAchievements: 'a',
      openLog: 'l',
      openPriceEvents: 'p',
      openStats: 'd',
      previousView: 'left',
      selectHoe: 'shift+h',
      selectScythe: 'shift+s',
      selectWateringCan: 'shift+w',
      toggleMenu: 'm',
    }

    this.keyHandlers = {
      focusCows: () =>
        this.state.purchasedCowPen &&
        this.setState({ stageFocus: stageFocusType.COW_PEN }),
      focusField: () => this.setState({ stageFocus: stageFocusType.FIELD }),
      focusHome: () => this.setState({ stageFocus: stageFocusType.HOME }),
      focusKitchen: () => this.setState({ stageFocus: stageFocusType.KITCHEN }),
      focusShop: () => this.setState({ stageFocus: stageFocusType.SHOP }),
      incrementDay: () => this.incrementDay(),
      nextView: this.focusNextView.bind(this),
      openAccounting: () =>
        this.setState({ currentDialogView: dialogView.ACCOUNTING }),
      openAchievements: () =>
        this.setState({ currentDialogView: dialogView.ACHIEVEMENTS }),
      openLog: () =>
        this.setState({ currentDialogView: dialogView.FARMERS_LOG }),
      openPriceEvents: () =>
        this.setState({ currentDialogView: dialogView.PRICE_EVENTS }),
      openStats: () => this.setState({ currentDialogView: dialogView.STATS }),
      previousView: this.focusPreviousView.bind(this),
      selectHoe: () => this.handlers.handleFieldModeSelect(CLEANUP),
      selectScythe: () => this.handlers.handleFieldModeSelect(HARVEST),
      selectWateringCan: () => this.handlers.handleFieldModeSelect(WATER),
      toggleMenu: () => this.handlers.handleMenuToggle(),
    }

    // TODO: Disable this is non-dev environments.
    Object.assign(this.keyMap, {
      clearPersistedData: 'shift+d',
      waterAllPlots: 'w',
    })

    Object.assign(this.keyHandlers, {
      clearPersistedData: () => this.clearPersistedData(),
      waterAllPlots: () => this.waterAllPlots(this.state),
    })
  }

  initReducers() {
    ;[
      'adjustLoan',
      'computeStateForNextDay',
      'changeCowName',
      'clearPlot',
      'fertilizeCrop',
      'harvestAll',
      'harvestPlot',
      'hugCow',
      'makeRecipe',
      'modifyCow',
      'purchaseCow',
      'purchaseCowPen',
      'purchaseField',
      'purchaseItem',
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
        this.showNotification(LOAN_INCREASED`${STANDARD_LOAN_AMOUNT}`, 'info')
      }

      this.setState({ hasBooted: true })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { hasBooted, stageFocus, isMenuOpen } = this.state

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

    if (stageFocus !== prevState.stageFocus && isMenuOpen) {
      this.setState(() => ({ isMenuOpen: !doesMenuObstructStage() }))
    }

    ;[
      'showCowPenPurchasedNotifications',
      'showRecipeLearnedNotifications',
    ].forEach(fn => this[fn](prevState))
  }

  clearPersistedData() {
    this.localforage
      .clear()
      .then(() => this.showNotification('localforage.clear() succeeded!'))
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
      () => {
        this.localforage
          .setItem(
            'state',
            Farmhand.reduceByPersistedKeys({
              ...this.state,

              // Old pendingNotifications are persisted so that they can be
              // shown to the player when the app reloads.
              newDayNotifications: pendingNotifications,
            })
          )
          .then(({ newDayNotifications }) =>
            []
              .concat(newDayNotifications)
              .concat(
                isFirstDay
                  ? []
                  : [{ message: PROGRESS_SAVED_MESSAGE, severity: 'info' }]
              )
              .forEach(({ message, severity }) =>
                this.showNotification(message, severity)
              )
          )
          .catch(e => {
            console.error(e)

            this.showNotification(JSON.stringify(e))
          })
      }
    )
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

  render() {
    const {
      fieldToolInventory,
      handlers,
      keyHandlers,
      keyMap,
      plantableCropInventory,
      playerInventory,
      playerInventoryQuantities,
      viewList,
      viewTitle,
    } = this

    // Bundle up the raw state and the computed state into one object to be
    // passed down through the component tree.
    const gameState = {
      ...this.state,
      fieldToolInventory,
      plantableCropInventory,
      playerInventory,
      playerInventoryQuantities,
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
                <DebugMenu />
              </Drawer>
              <Stage />

              {/*
              The .end-day button needs to be at this top level instead of the
              Stage because of scrolling issues in iOS.
              */}
              <div className="bottom-controls">
                <Fab
                  {...{
                    'aria-label': 'Previous view',
                    color: 'primary',
                    onClick: () => this.focusPreviousView(),
                  }}
                >
                  <KeyboardArrowLeft />
                </Fab>
                <Tooltip
                  {...{
                    placement: 'top',
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
                      color: 'secondary',
                      onClick: handlers.handleClickEndDayButton,
                    }}
                  >
                    <HotelIcon />
                  </Fab>
                </Tooltip>
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
            <NotificationSystem />
          </FarmhandContext.Provider>
        </MuiThemeProvider>
      </GlobalHotKeys>
    )
  }
}
