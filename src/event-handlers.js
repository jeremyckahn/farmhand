import { fieldMode } from './enums';

const { CLEANUP, HARVEST, PLANT, WATER } = fieldMode;

export default {
  /**
   * @param {farmhand.item} item
   */
  handleItemPurchase(item) {
    this.purchaseItem(item);
  },

  /**
   * @param {farmhand.item} item
   */
  handleItemSell(item) {
    this.sellItem(item);
  },

  /**
   * @param {external:React.SyntheticEvent} e
   */
  handleViewChange({ target: { value } }) {
    this.setState({ stageFocus: value });
  },

  /**
   * @param {farmhand.item} item
   */
  handlePlantableItemSelect({ id }) {
    this.setState({
      selectedPlantableItemId: id,
      fieldMode: fieldMode.PLANT,
    });
  },

  /**
   * @param {farmhand.module:enums.fieldMode} fieldMode
   */
  handleFieldModeSelect(fieldMode) {
    const selectedPlantableItemId =
      fieldMode === PLANT ? this.state.selectedPlantableItemId : '';

    this.setState({ selectedPlantableItemId, fieldMode });
  },

  /**
   * @param {number} x
   * @param {number} y
   */
  handlePlotClick(x, y) {
    const { selectedPlantableItemId, fieldMode } = this.state;

    if (fieldMode === PLANT) {
      this.plantInPlot(x, y, selectedPlantableItemId);
    } else if (fieldMode === HARVEST) {
      this.clearPlot(x, y);
    } else if (fieldMode === CLEANUP) {
      this.harvestPlot(x, y);
    } else if (fieldMode === WATER) {
      this.waterPlot(x, y);
    }
  },

  handleEndDayButtonClick() {
    this.incrementDay();
  },

  handleClearPersistedDataClick() {
    this.clearPersistedData();
  },

  handleWaterAllPlotsClick() {
    this.waterAllPlots();
  },
};
