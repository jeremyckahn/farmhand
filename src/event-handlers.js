import {
  clearPlot,
  fertilizeCrop,
  harvestPlot,
  plantInPlot,
  waterPlot,
} from './reducers'
import { moneyTotal } from './utils'
import { FIELD_ZOOM_SCALE_DISABLE_SWIPE_THRESHOLD } from './constants'
import { dialogView, fieldMode } from './enums'

const {
  CLEANUP,
  FERTILIZE,
  HARVEST,
  PLANT,
  SET_SCARECROW,
  SET_SPRINKLER,
  WATER,
} = fieldMode

const toolbeltFieldModes = [CLEANUP, HARVEST, WATER]

export default {
  /**
   * @param {farmhand.item} item
   * @param {number} [howMany=1]
   */
  handleItemPurchaseClick(item, howMany = 1) {
    this.purchaseItem(item, howMany)
  },

  /**
   * @param {farmhand.recipe} recipe
   */
  handleMakeRecipeClick(recipe) {
    this.makeRecipe(recipe)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowPurchaseClick(cow) {
    this.purchaseCow(cow)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowSellClick(cow) {
    this.sellCow(cow)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowHugClick(cow) {
    this.hugCow(cow.id)
  },

  /**
   * @param {external:React.SyntheticEvent} e
   * @param {farmhand.cow} cow
   */
  handleCowNameInputChange({ target: { value } }, cow) {
    this.changeCowName(cow.id, value)
  },

  /**
   * @param {farmhand.item} item
   * @param {number} [howMany=1]
   */
  handleItemSellClick(item, howMany = 1) {
    this.sellItem(item, howMany)
  },

  /**
   * @param {external:React.SyntheticEvent} e
   */
  handleViewChange({ target: { value } }) {
    this.setState({ stageFocus: value })
  },

  /**
   * @param {farmhand.module:enums.fieldMode} fieldMode
   */
  handleFieldModeSelect(fieldMode) {
    this.setState(({ selectedItemId }) => ({
      selectedItemId:
        fieldMode !== PLANT || toolbeltFieldModes.includes(fieldMode)
          ? ''
          : selectedItemId,
      fieldMode,
    }))
  },

  handleHarvestAllClick() {
    this.harvestAll()
  },

  /**
   * @param {farmhand.item} item
   */
  handleItemSelectClick({
    id,
    enablesFieldMode,
    hoveredPlotRangeSize: newHoveredPlotRangeSize,
  }) {
    this.setState(({ hoveredPlotRangeSize }) => ({
      fieldMode: enablesFieldMode,
      hoveredPlotRangeSize:
        // newHoveredPlotRangeSize is either a number or undefined.
        typeof newHoveredPlotRangeSize === 'number'
          ? newHoveredPlotRangeSize
          : hoveredPlotRangeSize,
      selectedItemId: id,
    }))
  },

  /**
   * @param {number} x
   * @param {number} y
   */
  handlePlotClick(x, y) {
    const {
      fieldMode,
      hoveredPlotRangeSize: rangeRadius,
      selectedItemId,
    } = this.state

    if (fieldMode === PLANT) {
      this.forRange(plantInPlot, rangeRadius, x, y, selectedItemId)
    } else if (fieldMode === HARVEST) {
      this.forRange(harvestPlot, rangeRadius, x, y)
    } else if (fieldMode === CLEANUP) {
      this.forRange(clearPlot, rangeRadius, x, y)
    } else if (fieldMode === WATER) {
      this.forRange(waterPlot, rangeRadius, x, y)
    } else if (fieldMode === FERTILIZE) {
      this.forRange(fertilizeCrop, rangeRadius, x, y)
    } else if (fieldMode === SET_SPRINKLER) {
      this.setSprinkler(x, y)
    } else if (fieldMode === SET_SCARECROW) {
      this.setScarecrow(x, y)
    }
  },

  /**
   * @param {number} range
   */
  handleFieldActionRangeChange(range) {
    this.setState(() => ({ hoveredPlotRangeSize: range }))
  },

  handleClickEndDayButton() {
    this.incrementDay()
  },

  /**
   * @param {number} amount
   */
  handleAddMoneyClick(amount) {
    this.setState(({ money }) => ({ money: moneyTotal(money, amount) }))
  },

  handleClearPersistedDataClick() {
    this.clearPersistedData()
  },

  handleWaterAllPlotsClick() {
    this.waterAllPlots(this.state)
  },

  /**
   * @param {number} fieldId
   */
  handleFieldPurchase(fieldId) {
    this.purchaseField(fieldId)
  },

  /**
   * @param {number} cowPenId
   */
  handleCowPenPurchase(cowPenId) {
    this.purchaseCowPen(cowPenId)
  },

  handleStorageExpansionPurchase() {
    this.purchaseStorageExpansion()
  },

  /**
   * @param {boolean} [setOpen]
   */
  handleMenuToggle(setOpen = null) {
    this.setState(({ isMenuOpen }) => ({
      isMenuOpen: setOpen === null ? !isMenuOpen : setOpen,
    }))
  },

  handleClickNextMenuButton() {
    this.focusNextView()
  },

  handleClickPreviousMenuButton() {
    this.focusPreviousView()
  },

  /**
   * @param {farmhand.cow}
   */
  handleCowSelect(cow) {
    this.selectCow(cow)
  },

  /**
   * @param {farmhand.cow}
   */
  handleCowClick(cow) {
    this.selectCow(cow)
    this.hugCow(cow.id)
  },

  handleCloseNotification(event, reason) {
    if (reason === 'clickaway') {
      return
    }

    this.setState(() => ({ doShowNotifications: false }))
  },

  handleNotificationClick() {
    this.setState(() => ({ doShowNotifications: false }))
  },

  handleNotificationExited() {
    this.setState({ notifications: [] })
  },

  /**
   * @param {farmhand.module:enums.dialogView} dialogView
   */
  handleClickDialogViewButton(dialogView) {
    this.setState({ currentDialogView: dialogView })
  },

  handleCloseDialogView() {
    this.setState({ currentDialogView: dialogView.NONE })
  },

  /**
   * @param {number} paydownAmount
   */
  handleClickLoanPaydownButton(paydownAmount) {
    this.adjustLoan(-paydownAmount)
  },

  /**
   * @param {number} loanAmount
   */
  handleClickTakeOutLoanButton(loanAmount) {
    this.adjustLoan(loanAmount)
  },

  /**
   * @param {Object} event
   * @see https://github.com/FormidableLabs/react-swipeable#event-data
   */
  handleSwipe({ event, initial: [startX], dir }) {
    let { target } = event

    while (target.parentElement) {
      let { classList, parentElement, scrollWidth } = target
      const { overflow, position, width } = window.getComputedStyle(target)

      // If the user is scrolling a horizontally overflowing element, or is
      // swiping on a `position: fixed` element, bail out of this event
      // handler.
      if (
        (overflow === 'scroll' && scrollWidth > parseInt(width, 10)) ||
        (position === 'fixed' && !classList.contains('Farmhand'))
      ) {
        return
      }

      target = parentElement
    }

    if (dir === 'Left') {
      if (this.state.isMenuOpen) {
        this.handlers.handleMenuToggle(false)
      } else {
        if (!this.state.blockSwipeNavigation) {
          this.focusNextView()
        }
      }
    } else if (dir === 'Right') {
      if (!this.state.isMenuOpen) {
        if (startX < window.screen.width * 0.15) {
          this.handlers.handleMenuToggle(true)
        } else {
          if (!this.state.blockSwipeNavigation) {
            this.focusPreviousView()
          }
        }
      }
    }
  },

  /**
   * @param {number} newScale
   */
  handleFieldZoom(newScale) {
    this.setState(() => ({
      blockSwipeNavigation:
        newScale >= FIELD_ZOOM_SCALE_DISABLE_SWIPE_THRESHOLD,
    }))
  },
}
