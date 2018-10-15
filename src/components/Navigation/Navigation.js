import React from 'react';
import Dinero from 'dinero.js';
import { func, number, object, shape } from 'prop-types';
import { stageFocusType } from '../../enums';

import './Navigation.css';

const Navigation = ({ handlers: { handleChangeView }, money, state }) => (
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
  money: number.isRequired,
  state: object.isRequired,
};

export default Navigation;
