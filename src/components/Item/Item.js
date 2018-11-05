import React from 'react';
import { bool, func, number, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { items as itemImages } from '../../img';

import './Item.sass';

const Item = ({
  handlers: { handlePurchaseItem, handleSellItem } = {},
  image,
  isPurchaseView,
  isSelected,
  isSellView,
  item,
  item: { id, name, quantity, value },
  state,
  state: { money },
}) => (
  <div className={classNames('Item', { 'is-selected': isSelected })}>
    <header>
      <h2>{name}</h2>
      <h3>{isPurchaseView ? `Price: ${value}` : `Sell price: ${value}`}</h3>
    </header>
    <img src={image || itemImages[id]} alt={name} />
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
  handlers: shape({
    handlePurchaseItem: func,
    handleSellItem: func,
  }),
  isPurchaseView: bool,
  isSelected: bool,
  isSellView: bool,
  image: string,
  item: object.isRequired,
  state: shape({
    money: number,
  }).isRequired,
};

export default Item;
