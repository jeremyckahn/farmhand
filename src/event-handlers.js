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
};
