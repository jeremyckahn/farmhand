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

  handleSellItem() {},

  /**
   * @param {external:React.SyntheticEvent} e
   */
  handleChangeView({ target: { value } }) {
    this.setState({ stageFocus: value });
  },
};
