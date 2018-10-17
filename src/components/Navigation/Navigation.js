import React from 'react';
import Dinero from 'dinero.js';
import { func, number, shape } from 'prop-types';
import { stageFocusType } from '../../enums';

import './Navigation.css';

const Navigation = ({ handlers: { handleChangeView }, state: { money } }) => (
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
      <option value={stageFocusType.FIELD}>Field</option>
      <option value={stageFocusType.INVENTORY}>Inventory</option>
      <option value={stageFocusType.SHOP}>Shop</option>
    </select>
  </header>
);

Navigation.propTypes = {
  handlers: shape({
    handleChangeView: func.isRequired,
  }).isRequired,
  state: shape({
    money: number.isRequired,
  }).isRequired,
};

export default Navigation;
