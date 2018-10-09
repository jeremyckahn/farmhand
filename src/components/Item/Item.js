import React from 'react';
import { func, number, object } from 'prop-types';

import './Item.css';

const Item = ({
  handlePurchaseItem,
  handleSellItem,
  item,
  item: { image, name, quantity, value },
  money,
  isPurchaseView = !!handlePurchaseItem, // eslint-disable-line react/prop-types
  isSellView = !!handleSellItem, // eslint-disable-line react/prop-types
}) => (
  <div className="Item">
    <header>
      <h2>{name}</h2>
      <h3>{isPurchaseView ? `Price: ${value}` : `Sell price: ${value}`}</h3>
    </header>
    <img src={image} alt={name} />
    {isPurchaseView && (
      <button
        className="purchase"
        disabled={value > money}
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
    {typeof quantity === 'number' && (
      <p>
        <strong>Quantity:</strong> {quantity}
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
