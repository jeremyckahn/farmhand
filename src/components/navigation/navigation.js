import React from 'react';
import Dinero from 'dinero.js';
import { func, number } from 'prop-types';
import { stageFocusType } from '../../enums';

import './Navigation.css';

const Navigation = ({ handleChangeView, money }) => (
  <header className="Navigation">
    <h1>Farmhand</h1>
    <h2>
      You have: $
      {Dinero({
        amount: Math.round(money * 100),
        precision: 2,
      }).toUnit()}
    </h2>
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
