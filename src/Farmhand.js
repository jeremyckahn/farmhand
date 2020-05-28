import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'
import memoize from 'fast-memoize'
import localforage from 'localforage'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
import HotelIcon from '@material-ui/icons/Hotel'
import Tooltip from '@material-ui/core/Tooltip'
import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'

import FarmhandContext from './Farmhand.context'
import eventHandlers from './event-handlers'
import * as reducers from './reducers'
import AppBar from './components/AppBar'
import Navigation from './components/Navigation'
import ContextPane from './components/ContextPane'
import Stage from './components/Stage'
import NotificationSystem from './components/NotificationSystem'
import DebugMenu from './components/DebugMenu'
import theme from './mui-theme'
import { createNewField, getItemValue, getRangeCoords } from './utils'
import shopInventory from './data/shop-inventory'
import { itemsMap, recipesMap } from './data/maps'
import { dialogView, fieldMode, stageFocusType } from './enums'
import { PURCHASEABLE_COW_PENS } from './constants'
import { COW_PEN_PURCHASED, RECIPE_LEARNED } from './templates'
import { PROGRESS_SAVED_MESSAGE } from './strings'

import './Farmhand.sass'

const { OBSERVE, SET_SPRINKLER } = fieldMode

const itemIds = Object.freeze(Object.keys(itemsMap))

const stageTitleMap = {
  [stageFocusType.HOME]: 'Home',
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.SHOP]: 'Shop',
  [stageFocusType.COW_PEN]: 'Cows',
  [stageFocusType.KITCHEN]: 'Kitchen',
  [stageFocusType.INVENTORY]: 'Inventory',
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
 * @property {number} dayCount
 * @property {Array.<Array.<?farmhand.plotContent>>} field
 * @property {farmhand.module:enums.fieldMode} fieldMode
 * @property {{ x: number, y: number }} hoveredPlot
 * @property {number} hoveredPlotRangeSize
 * @property {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @property {boolean} isMenuOpen
 * @property {Object} itemsSold Keys are items IDs, values are the number of
 * that item sold.
 * @property {Object} learnedRecipes Keys are recipe IDs, values are `true`.
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
    dayCount: 0,
    field: createNewField(),
    hasBooted: false,
    hoveredPlot: { x: null, y: null },
    hoveredPlotRangeSize: 0,
    inventory: [],
    isMenuOpen: true,
    itemsSold: {},
    learnedRecipes: {},
    money: 500,
    newDayNotifications: [],
    notifications: [],
    notificationLog: [],
    selectedCowId: '',
    selectedItemId: '',
    fieldMode: OBSERVE,
    priceCrashes: {},
    priceSurges: {},
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
      'dayCount',
      'field',
      'inventory',
      'itemsSold',
      'learnedRecipes',
      'money',
      'newDayNotifications',
      'notificationLog',
      'purchasedCowPen',
      'purchasedField',
      'priceCrashes',
      'priceSurges',
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

  get hoveredPlotRange() {
    const {
      field,
      fieldMode,
      hoveredPlot: { x, y },
      hoveredPlotRangeSize,
    } = this.state

    // If x is null, so is y.
    if (x === null) {
      return [[{ x: null, y: null }]]
    }

    if (fieldMode === SET_SPRINKLER) {
      return field[y][x]
        ? [[{ x, y }]]
        : getRangeCoords(hoveredPlotRangeSize, x, y)
    }

    return [[{ x, y }]]
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
    const { COW_PEN, FIELD, HOME, INVENTORY, KITCHEN, SHOP } = stageFocusType

    const viewList = [HOME, FIELD, SHOP]

    if (this.state.purchasedCowPen) {
      viewList.push(COW_PEN)
    }

    viewList.push(KITCHEN, INVENTORY)

    return viewList
  }

  initInputHandlers() {
    const keyHandlerThrottleTime = 150
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
      focusHome: 'h',
      focusField: 'f',
      focusInventory: 'i',
      focusCows: 'c',
      focusShop: 's',
      focusKitchen: 'k',
      openLog: 'l',
      openPriceEvents: 'p',
      openAchievements: 'a',
      incrementDay: 'shift+c',
      nextView: 'right',
      previousView: 'left',
      toggleMenu: 'm',
    }

    this.keyHandlers = {
      focusHome: () => this.setState({ stageFocus: stageFocusType.HOME }),
      focusField: () => this.setState({ stageFocus: stageFocusType.FIELD }),
      focusInventory: () =>
        this.setState({ stageFocus: stageFocusType.INVENTORY }),
      focusCows: () =>
        this.state.purchasedCowPen &&
        this.setState({ stageFocus: stageFocusType.COW_PEN }),
      focusShop: () => this.setState({ stageFocus: stageFocusType.SHOP }),
      focusKitchen: () => this.setState({ stageFocus: stageFocusType.KITCHEN }),
      incrementDay: () => this.incrementDay(),
      nextView: throttle(this.focusNextView.bind(this), keyHandlerThrottleTime),
      openLog: () =>
        this.setState({ currentDialogView: dialogView.FARMERS_LOG }),
      openPriceEvents: () =>
        this.setState({ currentDialogView: dialogView.PRICE_EVENTS }),
      openAchievements: () =>
        this.setState({ currentDialogView: dialogView.ACHIEVEMENTS }),

      previousView: throttle(
        this.focusPreviousView.bind(this),
        keyHandlerThrottleTime
      ),
      toggleMenu: () => this.handlers.handleMenuToggle(),
    }

    // TODO: Disable this is non-dev environments.
    Object.assign(this.keyMap, {
      clearPersistedData: 'shift+d',
      waterAllPlots: 'w',
    })

    Object.assign(this.keyHandlers, {
      clearPersistedData: () => this.clearPersistedData(),
      waterAllPlots: () => this.waterAllPlots(),
    })
  }

  initReducers() {
    ;[
      'computeStateForNextDay',
      'changeCowName',
      'clearPlot',
      'fertilizeCrop',
      'harvestPlot',
      'hugCow',
      'makeRecipe',
      'modifyCow',
      'purchaseCow',
      'purchaseCowPen',
      'purchaseField',
      'purchaseItem',
      'purchaseItemMax',
      'plantInPlot',
      'sellItem',
      'sellAllOfItem',
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
        this.incrementDay()
      }

      this.setState({ hasBooted: true })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    // The operations after this if block concern transient gameplay state, but
    // componentDidUpdate runs as part of the rehydration/bootup process. So,
    // check to see if the app has completed booting before doing anything with
    // this transient state.
    if (!this.state.hasBooted) {
      return
    }

    ;[
      'showCowPenPurchasedNotifications',
      'showRecipeLearnedNotifications',
    ].forEach(fn => this[fn](prevState))

    if (
      this.state.stageFocus === stageFocusType.COW_PEN &&
      prevState.stageFocus !== stageFocusType.COW_PEN
    ) {
      this.setState({ selectedCowId: '' })
    }

    const updatedAchievementsState = reducers.updateAchievements(this.state)

    if (updatedAchievementsState !== this.state) {
      this.setState(updatedAchievementsState)
    }
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

  incrementDay() {
    const nextDayState = reducers.computeStateForNextDay(this.state)
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
            [
              { message: PROGRESS_SAVED_MESSAGE, severity: 'info' },
              ...newDayNotifications,
            ].forEach(({ message, severity }) =>
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
      hoveredPlotRange,
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
      hoveredPlotRange,
      plantableCropInventory,
      playerInventory,
      playerInventoryQuantities,
      viewList,
      viewTitle,
    }

    return (
      <HotKeys className="hotkeys" keyMap={keyMap} handlers={keyHandlers}>
        <MuiThemeProvider theme={theme}>
          <FarmhandContext.Provider value={{ gameState, handlers }}>
            <div className="Farmhand fill">
              <NotificationSystem />
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
              <Tooltip
                {...{
                  title: 'End the day (shift + c)',
                }}
              >
                <Fab
                  {...{
                    'aria-label': 'End the day',
                    className: 'end-day',
                    color: 'primary',
                    onClick: handlers.handleClickEndDayButton,
                  }}
                >
                  <HotelIcon />
                </Fab>
              </Tooltip>
            </div>
          </FarmhandContext.Provider>
        </MuiThemeProvider>
      </HotKeys>
    )
  }
}
