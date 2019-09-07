import React from 'react';
import { array, func, number, object, string } from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGenderless,
  faMars,
  faVenus,
} from '@fortawesome/free-solid-svg-icons';

import { animals } from '../../img';
import FarmhandContext from '../../Farmhand.context';
import { cowColors, genders } from '../../enums';
import { dollarAmount, getCowValue } from '../../utils';
import { PURCHASEABLE_COW_PENS } from '../../constants';

import './CowPenContextMenu.sass';

const genderIcons = {
  [genders.FEMALE]: faVenus,
  [genders.GENDERLESS]: faGenderless,
  [genders.MALE]: faMars,
};

export const CowCard = ({
  cow,
  cowInventory,
  handleCowNameInputChange,
  handleCowPurchaseClick,
  handleCowSellClick,
  isSelected,
  money,
  purchasedCowPen,

  cowValue = getCowValue(cow),
  isNameEditable = !!handleCowNameInputChange,
  isPurchaseView = !!handleCowPurchaseClick,
  isSellView = !!handleCowSellClick,
}) => (
  <Card {...{ raised: isSelected }}>
    <CardHeader
      {...{
        avatar: (
          <img
            {...{ src: animals.cow[cowColors[cow.color].toLowerCase()] }}
            alt="Cow"
          />
        ),
        title: (
          <>
            {isNameEditable ? (
              <TextField
                {...{
                  onChange: e => handleCowNameInputChange(e, cow),
                  placeholder: 'Name',
                  value: cow.name,
                }}
              />
            ) : (
              cow.name
            )}{' '}
            <FontAwesomeIcon
              {...{
                icon: genderIcons[cow.gender],
              }}
            />
          </>
        ),
        subheader: (
          <>
            {isSellView && (
              <p>
                {cow.daysOld} {cow.daysOld === 1 ? 'day' : 'days'} old
              </p>
            )}
            <p>
              {isPurchaseView ? 'Price' : 'Value'}: ${dollarAmount(cowValue)}
            </p>
            <p>Weight: {cow.weight} lbs.</p>
          </>
        ),
      }}
    />
    <CardActions>
      {isPurchaseView && (
        <Button
          {...{
            className: 'purchase',
            color: 'primary',
            disabled:
              cowValue > money ||
              cowInventory.length >=
                PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows,
            onClick: () => handleCowPurchaseClick(cow),
            variant: 'contained',
          }}
        >
          Buy
        </Button>
      )}
      {isSellView && (
        <Button
          {...{
            className: 'sell',
            color: 'primary',
            onClick: () => handleCowSellClick(cow),
            variant: 'contained',
          }}
        >
          Sell
        </Button>
      )}
    </CardActions>
  </Card>
);

export const CowPenContextMenu = ({
  cowForSale,
  cowInventory,
  handleCowSelect,
  handleCowNameInputChange,
  handleCowPurchaseClick,
  handleCowSellClick,
  money,
  purchasedCowPen,
  selectedCowId,
}) => (
  <div className="CowPenContextMenu">
    <h2>For sale</h2>
    <CowCard
      {...{
        cow: cowForSale,
        cowInventory,
        handleCowPurchaseClick,
        money,
        purchasedCowPen,
      }}
    />
    <h2>
      Cows ({cowInventory.length} /{' '}
      {PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows})
    </h2>
    <ul className="card-list">
      {cowInventory.map(cow => (
        <li
          {...{
            key: cow.id,
            onFocus: () => handleCowSelect(cow),
            onClick: () => handleCowSelect(cow),
          }}
        >
          <CowCard
            {...{
              cow,
              cowInventory,
              handleCowNameInputChange,
              handleCowSellClick,
              isSelected: cow.id === selectedCowId,
              money,
              purchasedCowPen,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
);

CowPenContextMenu.propTypes = {
  cowForSale: object.isRequired,
  cowInventory: array.isRequired,
  handleCowNameInputChange: func.isRequired,
  handleCowPurchaseClick: func.isRequired,
  handleCowSelect: func.isRequired,
  handleCowSellClick: func.isRequired,
  money: number.isRequired,
  purchasedCowPen: number.isRequired,
  selectedCowId: string.isRequired,
};

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowPenContextMenu {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  );
}
