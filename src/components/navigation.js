import React from 'react';
import { func, number } from 'prop-types';
import { stageFocusType } from '../enums';

const Navigation = ({ handleChangeView, money }) => (
  <header className="navigation">
    <h1>Farmhand</h1>
    <h2>You have: ${money}</h2>
    <select onChange={handleChangeView}>
      <option value={stageFocusType.INVENTORY}>Inventory</option>
      <option value={stageFocusType.SHOP}>Shop</option>
    </select>
  </header>
);

Navigation.propTypes = {
  handleChangeView: func.isRequired,
  money: number.isRequired,
};

export default Navigation;
