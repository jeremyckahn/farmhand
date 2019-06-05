import React from 'react';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { bool, func, number, object } from 'prop-types';
import classNames from 'classnames';

import FarmhandContext from '../../Farmhand.context';
import { items } from '../../img';
import { itemsMap } from '../../data/maps';

import './Item.sass';

const PurchaseValueIndicator = ({ id, value, valueAdjustments }) =>
  value > itemsMap[id].value ? (
    <KeyboardArrowDown color="error" />
  ) : (
    <KeyboardArrowUp color="primary" />
  );

const SellValueIndicator = ({ id, value, valueAdjustments }) =>
  value < itemsMap[id].value ? (
    <KeyboardArrowDown color="error" />
  ) : (
    <KeyboardArrowUp color="primary" />
  );

export const Item = ({
  handleItemMaxOutClick,
  handleItemPurchaseClick,
  handleItemSelectClick,
  handleItemSellAllClick,
  handleItemSellClick,
  isPurchaseView,
  isSelectView,
  isSelected,
  isSellView,
  item,
  item: { id, name, value },
  money,
  playerInventoryQuantities,
  valueAdjustments,
}) => (
  <Card
    {...{
      className: classNames('Item', { 'is-selected': isSelected }),
      raised: isSelected,
    }}
  >
    <CardHeader
      {...{
        avatar: <img {...{ src: items[id] }} alt={name} />,
        title: name,
        subheader: (
          <div>
            {isPurchaseView && (
              <p>
                {`Price: $${value.toFixed(2)}`}
                <PurchaseValueIndicator {...{ id, value, valueAdjustments }} />
              </p>
            )}
            {isSellView && (
              <p>
                {`Sell price: $${value.toFixed(2)}`}
                <SellValueIndicator {...{ id, value, valueAdjustments }} />
              </p>
            )}
            <p>
              <strong>Quantity:</strong> {playerInventoryQuantities[id]}
            </p>
          </div>
        ),
      }}
    />
    <CardActions>
      {isSelectView && (
        <Button
          {...{
            className: 'select',
            color: 'primary',
            onClick: () => handleItemSelectClick(item),
            variant: isSelected ? 'contained' : 'outlined',
          }}
        >
          Select
        </Button>
      )}
      {isPurchaseView && (
        <>
          <Button
            {...{
              className: 'purchase',
              color: 'primary',
              disabled: value > money,
              onClick: () => handleItemPurchaseClick(item),
              variant: 'contained',
            }}
          >
            Buy
          </Button>
          <Button
            {...{
              className: 'max-out',
              color: 'primary',
              disabled: value > money,
              onClick: () => handleItemMaxOutClick(item),
              variant: 'contained',
            }}
          >
            Max Out
          </Button>
        </>
      )}
      {isSellView && (
        <>
          <Button
            {...{
              className: 'sell',
              color: 'secondary',
              onClick: () => handleItemSellClick(item),
              variant: 'contained',
            }}
          >
            Sell
          </Button>
          <Button
            {...{
              className: 'sell-all',
              color: 'secondary',
              onClick: () => handleItemSellAllClick(item),
              variant: 'contained',
            }}
          >
            Sell All
          </Button>
        </>
      )}
    </CardActions>
  </Card>
);

Item.propTypes = {
  handleItemMaxOutClick: func,
  handleItemPurchaseClick: func,
  handleItemSelectClick: func,
  handleItemSellClick: func,
  isPurchaseView: bool,
  isSelectView: bool,
  isSelected: bool,
  isSellView: bool,
  item: object.isRequired,
  money: number.isRequired,
  playerInventoryQuantities: object.isRequired,
  valueAdjustments: object.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Item {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
