export default {
  /**
   * @param {farmhand.item} item
   */
  handlePurchaseItem({ id, value = 0 }) {
    const { inventory } = this.state;
    let { money } = this.state;

    if (value > money) {
      return;
    }

    inventory[id] = inventory[id] || 0;
    inventory[id]++;

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
