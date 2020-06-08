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
   */
  handleItemMaxOutClick(item) {
    this.purchaseItemMax(item)
  },

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
   */
  handleItemSellClick(item) {
    this.sellItem(item)
  },

  /**
   * @param {farmhand.item} item
   */
  handleItemSellAllClick(item) {
    this.sellAllOfItem(item)
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

  handleItemSelectClick({ id, enablesFieldMode, hoveredPlotRangeSize = 0 }) {
    this.setState({
      fieldMode: enablesFieldMode,
      hoveredPlotRangeSize,
      selectedItemId: id,
    })
  },

  /**
   * @param {number} x
   * @param {number} y
   */
  handlePlotClick(x, y) {
    const { selectedItemId, fieldMode } = this.state

    if (fieldMode === PLANT) {
      this.plantInPlot(x, y, selectedItemId)
    } else if (fieldMode === HARVEST) {
      this.harvestPlot(x, y)
    } else if (fieldMode === CLEANUP) {
      this.clearPlot(x, y)
    } else if (fieldMode === WATER) {
      this.waterPlot(x, y)
    } else if (fieldMode === FERTILIZE) {
      this.fertilizeCrop(x, y)
    } else if (fieldMode === SET_SPRINKLER) {
      this.setSprinkler(x, y)
    } else if (fieldMode === SET_SCARECROW) {
      this.setScarecrow(x, y)
    }
  },

  handleClickEndDayButton() {
    this.incrementDay()
  },

  /**
   * @param {number} amount
   */
  handleAddMoneyClick(amount) {
    this.setState(({ money }) => ({ money: money + amount }))
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

  handleMenuToggle() {
    this.setState(({ isMenuOpen }) => ({ isMenuOpen: !isMenuOpen }))
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
    // This is necessary to prevent NREs from within MUI.
    // https://codesandbox.io/s/bbo9w?file=/demo.js
    if (reason === 'clickaway') {
      return
    }

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
}
