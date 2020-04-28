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
import {
  addItemToInventory,
  updateLearnedRecipes,
  computeStateForNextDay,
  decrementItemFromInventory,
  getWateredField,
  makeRecipe,
  modifyFieldPlotAt,
  purchaseItem,
  removeFieldPlotAt,
} from './data-transformers'
import AppBar from './components/AppBar'
import Navigation from './components/Navigation'
import ContextPane from './components/ContextPane'
import Stage from './components/Stage'
import NotificationSystem from './components/NotificationSystem'
import DebugMenu from './components/DebugMenu'
import theme from './mui-theme'
import {
  createNewField,
  getCropFromItemId,
  getCropLifeStage,
  getCowValue,
  getItemValue,
  getPlotContentFromItemId,
  getRangeCoords,
  getAdjustedItemValue,
  getFinalCropItemIdFromSeedItemId,
  generateCow,
} from './utils'
import shopInventory from './data/shop-inventory'
import { itemsMap, recipesMap } from './data/maps'
import { cropLifeStage, fieldMode, itemType, stageFocusType } from './enums'
import {
  COW_HUG_BENEFIT,
  FERTILIZER_ITEM_ID,
  MAX_ANIMAL_NAME_LENGTH,
  MAX_DAILY_COW_HUG_BENEFITS,
  PURCHASEABLE_COW_PENS,
  PURCHASEABLE_FIELD_SIZES,
  SCARECROW_ITEM_ID,
  SPRINKLER_ITEM_ID,
} from './constants'
import { COW_PEN_PURCHASED, RECIPE_LEARNED } from './templates'
import { PROGRESS_SAVED_MESSAGE } from './strings'

import './Farmhand.sass'

const { GROWN } = cropLifeStage
const { FERTILIZE, OBSERVE, SET_SCARECROW, SET_SPRINKLER } = fieldMode

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
 * @property {farmhand.cow} cowForSale
 * @property {Array.<farmhand.cow>} cowInventory
 * @property {number} dayCount
 * @property {Array.<Array.<?farmhand.plotContent>>} field
 * @property {farmhand.module:enums.fieldMode} fieldMode
 * @property {{ x: number, y: number }} hoveredPlot
 * @property {number} hoveredPlotRangeSize
 * @property {Array.<{ item: farmhand.item, quantity: number }>} inventory
 * @property {boolean} isMenuOpen
 * @property {Object} learnedRecipes Keys are recipe IDs, values are `true`.
 * @property {number} money
 * @property {Array.<string} newDayNotifications
 * @property {Array.<string>} notifications
 * @property {string} selectedCowId
 * @property {string} selectedItemId
 * @property {Object} itemsSold Keys are items IDs, values are the number of
 * that item sold.
 * @property {number} purchasedCowPen
 * @property {number} purchasedField
 * @property {Array.<farmhand.item>} shopInventory
 * @property {boolean} doShowNotifications
 * @property {farmhand.module:enums.stageFocusType} stageFocus
 * @property {Object.<number>} valueAdjustments
 */

export default class Farmhand extends Component {
  // TODO: Move as much of the logic in this class to ./data-transformers.js as
  // possible.

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
    selectedCowId: '',
    selectedItemId: '',
    fieldMode: OBSERVE,
    purchasedCowPen: 0,
    purchasedField: 0,
    shopInventory: [...shopInventory],
    doShowNotifications: false,
    stageFocus: stageFocusType.FIELD,
    valueAdjustments: {},
  }

  constructor() {
    super(...arguments)

    this.initInputHandlers()
  }

  static reduceByPersistedKeys(state) {
    return [
      'cowForSale',
      'cowInventory',
      'dayCount',
      'field',
      'inventory',
      'itemsSold',
      'learnedRecipes',
      'money',
      'newDayNotifications',
      'purchasedCowPen',
      'purchasedField',
      'valueAdjustments',
    ].reduce((acc, key) => {
      acc[key] = state[key]

      return acc
    }, {})
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
    const { COW_PEN, FIELD, INVENTORY, KITCHEN, SHOP } = stageFocusType

    const viewList = [FIELD, SHOP]

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
      focusField: 'f',
      focusInventory: 'i',
      focusCows: 'c',
      focusShop: 's',
      focusKitchen: 'k',
      incrementDay: 'shift+c',
      nextView: 'right',
      previousView: 'left',
      toggleMenu: 'm',
    }

    this.keyHandlers = {
      focusField: () => this.setState({ stageFocus: stageFocusType.FIELD }),
      focusInventory: () =>
        this.setState({ stageFocus: stageFocusType.INVENTORY }),
      focusCows: () =>
        this.state.purchasedCowPen &&
        this.setState({ stageFocus: stageFocusType.COW_PEN }),
      focusShop: () => this.setState({ stageFocus: stageFocusType.SHOP }),
      focusKitchen: () => this.setState({ stageFocus: stageFocusType.KITCHEN }),
      incrementDay: () => this.incrementDay(),
      nextView: throttle(this.goToNextView.bind(this), keyHandlerThrottleTime),
      previousView: throttle(
        this.goToPreviousView.bind(this),
        keyHandlerThrottleTime
      ),
      toggleMenu: () => this.handlers.handleMenuToggle(),
    }

    Object.assign(this.keyMap, {
      clearPersistedData: 'shift+d',
      waterAllPlots: 'w',
    })

    Object.assign(this.keyHandlers, {
      clearPersistedData: () => this.clearPersistedData(),
      waterAllPlots: () => this.waterAllPlots(),
    })
  }

  componentDidMount() {
    this.localforage.getItem('state').then(state => {
      if (state) {
        const { newDayNotifications } = state
        this.setState({ ...state, newDayNotifications: [] }, () => {
          newDayNotifications.forEach(notification =>
            this.showNotification(notification)
          )
        })
      } else {
        this.incrementDay()
      }

      this.setState({ hasBooted: true })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    // The operations in this if block concern transient gameplay state, but
    // componentDidUpdate runs as part of the rehydration/bootup process. So,
    // check to see if the app has completed booting before working with this
    // transient state.
    if (this.state.hasBooted) {
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
    }
  }

  clearPersistedData() {
    this.localforage
      .clear()
      .then(() => this.showNotification('localforage.clear() succeeded!'))
  }

  /**
   * @param {string} message
   */
  showNotification(message) {
    this.setState(({ notifications }) => ({
      // Don't show redundant notifications
      notifications: notifications.includes(message)
        ? notifications
        : notifications.concat(message),
      doShowNotifications: true,
    }))
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
    const nextDayState = computeStateForNextDay(this.state)
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
              PROGRESS_SAVED_MESSAGE,
              ...newDayNotifications,
            ].forEach(notification => this.showNotification(notification))
          )
          .catch(e => {
            console.error(e)

            this.showNotification(JSON.stringify(e))
          })
      }
    )
  }

  goToNextView() {
    const { viewList } = this

    this.setState(({ stageFocus }) => {
      const currentViewIndex = viewList.indexOf(stageFocus)

      return { stageFocus: viewList[(currentViewIndex + 1) % viewList.length] }
    })
  }

  goToPreviousView() {
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
   * @param {farmhand.item} item
   * @param {number} [howMany=1]
   */
  purchaseItem(item, howMany = 1) {
    this.setState(state => purchaseItem(state, item, howMany))
  }

  /**
   * @param {farmhand.item} item
   */
  purchaseItemMax(item) {
    this.setState(state => {
      const { money, valueAdjustments } = state

      return purchaseItem(
        state,
        item,
        Math.floor(money / getAdjustedItemValue(valueAdjustments, item.id))
      )
    })
  }

  /**
   * @param {farmhand.item} item
   * @param {number} [howMany=1]
   */
  sellItem({ id }, howMany = 1) {
    if (howMany === 0) {
      return
    }

    this.setState(({ inventory, itemsSold, money, valueAdjustments }) =>
      updateLearnedRecipes({
        ...this.state,
        inventory: decrementItemFromInventory(id, inventory, howMany),
        itemsSold: { ...itemsSold, [id]: (itemsSold[id] || 0) + howMany },
        money: money + getAdjustedItemValue(valueAdjustments, id) * howMany,
      })
    )
  }

  /**
   * @param {farmhand.item} item
   */
  sellAllOfItem(item) {
    const { id } = item
    const { inventory } = this.state
    const itemInInventory = inventory.find(item => item.id === id)

    if (!itemInInventory) {
      return
    }

    this.sellItem(item, itemInInventory.quantity)
  }

  /**
   * @param {farmhand.recipe} recipe
   */
  makeRecipe(recipe) {
    this.setState(state => makeRecipe(state, recipe))
  }

  /**
   * @param {farmhand.cow} cow
   */
  purchaseCow(cow) {
    this.setState(({ cowInventory, money, purchasedCowPen }) => {
      const cowValue = getCowValue(cow)
      if (
        money < cowValue ||
        purchasedCowPen === 0 ||
        cowInventory.length >= PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows
      ) {
        return
      }

      return {
        cowInventory: [...cowInventory, { ...cow }],
        money: money - cowValue,
        cowForSale: generateCow(),
      }
    })
  }

  /**
   * @param {farmhand.cow} cow
   */
  sellCow(cow) {
    this.setState(({ cowInventory, money }) => {
      const cowValue = getCowValue(cow)

      const newCowInventory = [...cowInventory]
      newCowInventory.splice(cowInventory.indexOf(cow), 1)

      return {
        cowInventory: newCowInventory,
        money: money + cowValue,
      }
    })
  }

  /**
   * @param {string} cowId
   * @param {Function(farmhand.cow)} fn Must return the modified cow or
   * undefined.
   */
  modifyCow(cowId, fn) {
    this.setState(({ cowInventory }) => {
      const cow = cowInventory.find(({ id }) => id === cowId)
      const cowIndex = cowInventory.indexOf(cow)
      const newCowInventory = [...cowInventory]

      newCowInventory[cowIndex] = {
        ...cow,
        ...fn(cow),
      }

      return {
        cowInventory: newCowInventory,
      }
    })
  }

  /**
   * @param {string} cowId
   */
  hugCow(cowId) {
    this.modifyCow(cowId, cow => {
      if (cow.happinessBoostsToday >= MAX_DAILY_COW_HUG_BENEFITS) {
        return
      }

      return {
        happiness: Math.min(1, cow.happiness + COW_HUG_BENEFIT),
        happinessBoostsToday: cow.happinessBoostsToday + 1,
      }
    })
  }

  /**
   * @param {string} cowId
   * @param {string} newName
   */
  changeCowName(cowId, newName) {
    this.modifyCow(cowId, cow => ({
      name: newName.slice(0, MAX_ANIMAL_NAME_LENGTH),
    }))
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string} plantableItemId
   */
  plantInPlot(x, y, plantableItemId) {
    if (!plantableItemId) {
      return
    }

    this.setState(({ field, inventory }) => {
      const row = field[y]
      const finalCropItemId = getFinalCropItemIdFromSeedItemId(plantableItemId)

      if (row[x]) {
        // Something is already planted in field[x][y]
        return
      }

      const newField = modifyFieldPlotAt(field, x, y, () =>
        getCropFromItemId(finalCropItemId)
      )

      const updatedInventory = decrementItemFromInventory(
        plantableItemId,
        inventory
      )

      const selectedItemId = updatedInventory.find(
        ({ id }) => id === plantableItemId
      )
        ? plantableItemId
        : ''

      return {
        field: newField,
        inventory: updatedInventory,
        selectedItemId,
      }
    })
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  fertilizeCrop(x, y) {
    this.setState(({ field, inventory }) => {
      const row = field[y]
      const crop = row[x]

      if (!crop || crop.type !== itemType.CROP || crop.isFertilized === true) {
        return
      }

      const updatedInventory = decrementItemFromInventory(
        FERTILIZER_ITEM_ID,
        inventory
      )

      const doFertilizersRemain = updatedInventory.some(
        item => item.id === FERTILIZER_ITEM_ID
      )

      return {
        field: modifyFieldPlotAt(field, x, y, crop => ({
          ...crop,
          isFertilized: true,
        })),
        fieldMode: doFertilizersRemain ? FERTILIZE : OBSERVE,
        inventory: updatedInventory,
        selectedItemId: doFertilizersRemain ? FERTILIZER_ITEM_ID : '',
      }
    })
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setSprinkler(x, y) {
    this.setState(({ field, hoveredPlotRangeSize, inventory }) => {
      const plot = field[y][x]

      // Only set sprinklers in empty plots
      if (plot !== null) {
        return
      }

      const updatedInventory = decrementItemFromInventory(
        SPRINKLER_ITEM_ID,
        inventory
      )

      const doSprinklersRemain = updatedInventory.some(
        item => item.id === SPRINKLER_ITEM_ID
      )

      const newField = modifyFieldPlotAt(field, x, y, () =>
        getPlotContentFromItemId(SPRINKLER_ITEM_ID)
      )

      return {
        field: newField,
        hoveredPlotRangeSize: doSprinklersRemain ? hoveredPlotRangeSize : 0,
        fieldMode: doSprinklersRemain ? SET_SPRINKLER : OBSERVE,
        inventory: updatedInventory,
        selectedItemId: doSprinklersRemain ? SPRINKLER_ITEM_ID : '',
      }
    })
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setScarecrow(x, y) {
    this.setState(({ field, inventory }) => {
      const plot = field[y][x]

      // Only set scarecrows in empty plots
      if (plot !== null) {
        return
      }

      const updatedInventory = decrementItemFromInventory(
        SCARECROW_ITEM_ID,
        inventory
      )

      const doScarecrowsRemain = updatedInventory.some(
        item => item.id === SCARECROW_ITEM_ID
      )

      const newField = modifyFieldPlotAt(field, x, y, () =>
        getPlotContentFromItemId(SCARECROW_ITEM_ID)
      )

      return {
        field: newField,
        inventory: updatedInventory,
        fieldMode: doScarecrowsRemain ? SET_SCARECROW : OBSERVE,
        selectedItemId: doScarecrowsRemain ? SCARECROW_ITEM_ID : '',
      }
    })
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  harvestPlot(x, y) {
    this.setState(state => {
      const { field } = state
      const row = field[y]
      const crop = row[x]

      if (
        !crop ||
        crop.type !== itemType.CROP ||
        getCropLifeStage(crop) !== GROWN
      ) {
        return
      }

      return addItemToInventory(
        {
          ...state,
          field: removeFieldPlotAt(field, x, y),
        },
        itemsMap[crop.itemId]
      )
    })
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  clearPlot(x, y) {
    this.setState(state => {
      const { field } = state
      const plotContent = field[y][x]

      if (!plotContent) {
        // Nothing planted in field[x][y]
        return
      }

      const item = itemsMap[plotContent.itemId]
      const snapshot = {
        ...state,
        field: removeFieldPlotAt(field, x, y),
      }

      return item.isReplantable ? addItemToInventory(snapshot, item) : snapshot
    })
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  waterPlot(x, y) {
    this.setState(({ field }) => {
      const plotContent = field[y][x]

      if (!plotContent || plotContent.type !== itemType.CROP) {
        return
      }

      return {
        field: modifyFieldPlotAt(field, x, y, crop => ({
          ...crop,
          wasWateredToday: true,
        })),
      }
    })
  }

  waterAllPlots() {
    this.setState(({ field }) => {
      return { field: getWateredField(field) }
    })
  }

  /**
   * @param {number} fieldId
   */
  purchaseField(fieldId) {
    this.setState(({ field, money, purchasedField }) => {
      if (purchasedField >= fieldId) {
        return
      }

      const { columns, price, rows } = PURCHASEABLE_FIELD_SIZES.get(fieldId)

      return {
        purchasedField: fieldId,
        field: new Array(rows)
          .fill(null)
          .map((_, row) =>
            new Array(columns)
              .fill(null)
              .map((_, column) => (field[row] && field[row][column]) || null)
          ),
        money: money - price,
      }
    })
  }

  /**
   * @param {number} cowPenId
   */
  purchaseCowPen(cowPenId) {
    this.setState(({ money, purchasedCowPen }) => {
      if (purchasedCowPen >= cowPenId) {
        return
      }

      return {
        purchasedCowPen: cowPenId,
        money: money - PURCHASEABLE_COW_PENS.get(cowPenId).price,
      }
    })
  }

  /**
   * @param {farmhand.cow} cow
   */
  selectCow({ id: selectedCowId }) {
    this.setState({ selectedCowId })
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
