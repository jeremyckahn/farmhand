import React from 'react';
import Item from '../Item';
import { getItemValue } from '../../utils';
import { array, bool, object } from 'prop-types';

import './Inventory.css';

const Inventory = ({
  handlers,
  isPurchaseView,
  isSellView,
  items,
  state,
  state: { money },
  valueAdjustments,
}) => (
  <div className="Inventory">
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Item
            {...{
              handlers,
              isPurchaseView,
              isSellView,
              item: {
                ...item,
                value: getItemValue(item, valueAdjustments),
              },
              money,
              state,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

Inventory.propTypes = {
  handlers: object.isRequired,
  items: array.isRequired,
  isPurchaseView: bool,
  isSellView: bool,
  state: object.isRequired,
  valueAdjustments: object.isRequired,
};

export default Inventory;
