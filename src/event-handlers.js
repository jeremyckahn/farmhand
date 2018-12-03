import { decrementItemFromInventory } from './utils';
import { toolType } from './enums';

export default {
  /**
   * @param {farmhand.item} item
   */
  handleItemPurchase(item) {
    const { id, value = 0 } = item;
    const { inventory } = this.state;
    let { money } = this.state;

    if (value > money) {
      return;
    }

    const currentItemSlot = inventory.findIndex(
      ({ id: itemId }) => id === itemId
    );

    if (~currentItemSlot) {
      inventory[currentItemSlot].quantity++;
    } else {
      inventory.push({ id, quantity: 1 });
    }

    money -= value;

    this.setState({ inventory, money });
  },

  /**
   * @param {farmhand.item} item
   */
  handleItemSell(item) {
    const { id, value = 0 } = item;
    const { inventory, money } = this.state;

    this.setState({
      inventory: decrementItemFromInventory(id, inventory),
      money: money + value,
    });
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
    this.setState({ selectedPlantableItemId: id, selectedTool: toolType.NONE });
  },

  /**
   * @param {farmhand.module:enums.toolType} toolType
   */
  handleToolSelect(toolType) {
    this.setState({ selectedPlantableItemId: '', selectedTool: toolType });
  },

  /**
   * @param {number} x
   * @param {number} y
   */
  handlePlotClick(x, y) {
    const { selectedPlantableItemId, selectedTool } = this.state;

    if (selectedTool === toolType.NONE) {
      this.plantInPlot(x, y, selectedPlantableItemId);
    } else if (selectedTool === toolType.WATERING_CAN) {
      this.waterPlot(x, y);
    }
  },

  handleEndDayButtonClick() {
    this.incrementDay();
  },

  handleWaterAllPlotsClick() {
    this.waterAllPlots();
  },
};
