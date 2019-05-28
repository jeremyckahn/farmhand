import { fieldMode } from './enums';

const {
  CLEANUP,
  FERTILIZE,
  HARVEST,
  PLANT,
  SET_SCARECROW,
  SET_SPRINKLER,
  WATER,
} = fieldMode;

const toolbeltFieldModes = [CLEANUP, HARVEST, WATER];

export default {
  /**
   * @param {farmhand.item} item
   */
  handleItemPurchaseClick(item) {
    this.purchaseItem(item);
  },

  /**
   * @param {farmhand.item} item
   */
  handleItemSellClick(item) {
    this.sellItem(item);
  },

  /**
   * @param {farmhand.item} item
   */
  handleItemSellAllClick(item) {
    this.sellAllOfItem(item);
  },

  /**
   * @param {external:React.SyntheticEvent} e
   */
  handleViewChange({ target: { value } }) {
    this.setState({ stageFocus: value });
  },

  /**
   * @param {farmhand.module:enums.fieldMode} fieldMode
   */
  handleFieldModeSelect(fieldMode) {
    const selectedItemId = fieldMode === PLANT ? this.state.selectedItemId : '';
    const isToolbeltFieldMode = toolbeltFieldModes.includes(fieldMode);

    this.setState({
      selectedItemId: isToolbeltFieldMode ? '' : selectedItemId,
      fieldMode,
    });
  },

  handleItemSelectClick({ id, enablesFieldMode, hoveredPlotRangeSize = 0 }) {
    this.setState({
      fieldMode: enablesFieldMode,
      hoveredPlotRangeSize,
      selectedItemId: id,
    });
  },

  /**
   * @param {number} x
   * @param {number} y
   */
  handlePlotClick(x, y) {
    const { selectedItemId, fieldMode } = this.state;

    if (fieldMode === PLANT) {
      this.plantInPlot(x, y, selectedItemId);
    } else if (fieldMode === HARVEST) {
      this.harvestPlot(x, y);
    } else if (fieldMode === CLEANUP) {
      this.clearPlot(x, y);
    } else if (fieldMode === WATER) {
      this.waterPlot(x, y);
    } else if (fieldMode === FERTILIZE) {
      this.fertilizeCrop(x, y);
    } else if (fieldMode === SET_SPRINKLER) {
      this.setSprinkler(x, y);
    } else if (fieldMode === SET_SCARECROW) {
      this.setScarecrow(x, y);
    }
  },

  /**
   * @param {number} x
   * @param {number} y
   */
  handlePlotMouseOver(x, y) {
    this.setState({ hoveredPlot: { x, y } });
  },

  handleClickEndDayButton() {
    this.incrementDay();
  },

  handleClearPersistedDataClick() {
    this.clearPersistedData();
  },

  handleWaterAllPlotsClick() {
    this.waterAllPlots();
  },

  /**
   * @param {number} fieldId
   */
  handleFieldPurchase(fieldId) {
    this.purchaseField(fieldId);
  },

  handleMenuToggle() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  },

  handleClickNextMenuButton() {
    this.goToNextView();
  },

  handleClickPreviousMenuButton() {
    this.goToPreviousView();
  },

  handleCloseNotification() {
    this.setState({ doShowNotifications: false });
  },

  handleNotificationExited() {
    this.setState({ notifications: [] });
  },
};
