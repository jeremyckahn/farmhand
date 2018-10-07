import React from 'react';
import { func, number, object } from 'prop-types';

import './Item.css';

const Item = ({
  handlePurchaseItem,
  handleSellItem,
  item,
  money,
  isPurchaseView = !!handlePurchaseItem, // eslint-disable-line react/prop-types
  isSellView = !!handleSellItem, // eslint-disable-line react/prop-types
}) => (
  <div className="Item">
    <header>
      <h2>{item.name}</h2>
      <h3>
        {isPurchaseView ? `Price: ${item.value}` : `Sell price: ${item.value}`}
      </h3>
    </header>
    {isPurchaseView && (
      <button
        className="purchase"
        disabled={item.value > money}
        onClick={() => handlePurchaseItem(item)}
      >
        Buy
      </button>
    )}
    {isSellView && (
      <button className="sell" onClick={() => handleSellItem(item)}>
        Sell
      </button>
    )}
    {typeof item.quantity === 'number' && (
      <p>
        <strong>Quantity:</strong> {item.quantity}
      </p>
    )}
  </div>
);

Item.propTypes = {
  handlePurchaseItem: func,
  handleSellItem: func,
  item: object.isRequired,
  money: number,
};

export default Item;
