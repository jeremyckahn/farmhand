export default {
  /**
   * @param {farmhand.item} item
   */
  handlePurchaseItem({ name }) {
    const { inventory } = this.state;

    inventory[name] = inventory[name] || 0;
    inventory[name]++;

    this.setState({ inventory });
  },

  /**
   * @param {external:React.SyntheticEvent} e
   */
  handleChangeView({ target: { value } }) {
    this.setState({ stageFocus: value });
  },
};
