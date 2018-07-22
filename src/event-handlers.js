export default {
  /**
   * @param {farmhand.item} item
   */
  handlePurchaseItem({ id }) {
    const { inventory } = this.state;

    inventory[id] = inventory[id] || 0;
    inventory[id]++;

    this.setState({ inventory });
  },

  /**
   * @param {external:React.SyntheticEvent} e
   */
  handleChangeView({ target: { value } }) {
    this.setState({ stageFocus: value });
  },
};
