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

    const currentItemSlot = inventory.findIndex(({ item }) => item.id === id);

    if (~currentItemSlot) {
      inventory[currentItemSlot].amount++;
    } else {
      inventory.push({ item, amount: 1 });
    }

    money -= value;

    this.setState({ inventory, money });
  },

  /**
   * @param {external:React.SyntheticEvent} e
   */
  handleChangeView({ target: { value } }) {
    this.setState({ stageFocus: value });
  },
};
