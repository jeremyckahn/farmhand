import React from 'react';
import { array, func, number, object, string } from 'prop-types';
import Field from '../Field';
import Inventory from '../Inventory';
import Shop from '../Shop';
import { stageFocusType } from '../../enums';

import './Stage.css';

const stageTitleMap = {
  [stageFocusType.FIELD]: 'Field',
  [stageFocusType.INVENTORY]: 'Your inventory',
  [stageFocusType.SHOP]: 'Shop',
};

const Stage = ({
  fieldHeight,
  fieldWidth,
  handlePlotClick,
  handlePurchaseItem,
  handleSellItem,
  inventory,
  money,
  selectedPlantableItemId,
  shopInventory,
  stageFocus,
  valueAdjustments,
}) => (
  <div className="Stage">
    <h2>{stageTitleMap[stageFocus]}</h2>
    {stageFocus === stageFocusType.FIELD && (
      <Field
        {...{
          handlePlotClick,
          columns: fieldWidth,
          rows: fieldHeight,
          selectedPlantableItemId,
        }}
      />
    )}
    {stageFocus === stageFocusType.INVENTORY && (
      <Inventory
        {...{ handleSellItem, items: inventory, money, valueAdjustments }}
      />
    )}
    {stageFocus === stageFocusType.SHOP && (
      <Shop
        {...{
          handlePurchaseItem,
          items: shopInventory,
          money,
          valueAdjustments,
        }}
      />
    )}
  </div>
);

Stage.propTypes = {
  fieldHeight: number.isRequired,
  fieldWidth: number.isRequired,
  handlePlotClick: func.isRequired,
  handlePurchaseItem: func.isRequired,
  handleSellItem: func.isRequired,
  inventory: array.isRequired,
  money: number.isRequired,
  selectedPlantableItemId: string.isRequired,
  shopInventory: array.isRequired,
  stageFocus: string.isRequired,
  valueAdjustments: object.isRequired,
};

export default Stage;
