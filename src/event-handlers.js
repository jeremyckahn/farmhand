import { getCropFromItemId } from './utils';

export default {
  /**
   * @param {farmhand.item} item
   */
  handlePurchaseItem(item) {
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
  handleSellItem(item) {
    const { id, value = 0 } = item;
    let { inventory, money } = this.state;

    inventory = [...inventory];

    const itemInventoryIndex = inventory.findIndex(
      ({ id: itemId }) => id === itemId
    );

    const { quantity } = inventory[itemInventoryIndex];

    if (quantity > 1) {
      inventory[itemInventoryIndex] = {
        ...inventory[itemInventoryIndex],
        quantity: quantity - 1,
      };
    } else {
      inventory.splice(itemInventoryIndex, 1);
    }

    money += value;

    this.setState({ inventory, money });
  },

  /**
   * @param {external:React.SyntheticEvent} e
   */
  handleChangeView({ target: { value } }) {
    this.setState({ stageFocus: value });
  },

  /**
   * @param {farmhand.item} item
   */
  handleSelectPlantableItem({ id }) {
    this.setState({ selectedPlantableItemId: id });
  },

  /**
   * @param {number} x
   * @param {number} y
   */
  handlePlotClick(x, y) {
    const { selectedPlantableItemId } = this.state;

    if (selectedPlantableItemId) {
      console.log(getCropFromItemId(selectedPlantableItemId));
    }
  },
};
