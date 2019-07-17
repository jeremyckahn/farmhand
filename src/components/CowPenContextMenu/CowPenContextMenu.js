import React from 'react';
import { array, func, number, object } from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGenderless,
  faMars,
  faVenus,
} from '@fortawesome/free-solid-svg-icons';

import { animals } from '../../img';
import FarmhandContext from '../../Farmhand.context';
import { genders } from '../../enums';
import { dollarAmount, getCowValue } from '../../utils';
import { PURCHASEABLE_COW_PENS } from '../../constants';

import './CowPenContextMenu.sass';

const genderIcons = {
  [genders.FEMALE]: faVenus,
  [genders.GENDERLESS]: faGenderless,
  [genders.MALE]: faMars,
};

export const CowPenContextMenu = ({
  cowForSale,
  cowInventory,
  handleCowPurchaseClick,
  money,
  purchasedCowPen,

  cowValue = getCowValue(cowForSale),
}) => (
  <div className="CowPenContextMenu">
    <h2>For sale</h2>
    <Card>
      <CardHeader
        {...{
          avatar: <img {...{ src: animals.cow.white }} alt="Cow" />,
          title: (
            <p>
              {cowForSale.name}{' '}
              <FontAwesomeIcon
                {...{
                  icon: genderIcons[cowForSale.gender],
                }}
              />
            </p>
          ),
          subheader: (
            <>
              <p>Price: ${dollarAmount(cowValue)}</p>
              <p>Weight: {cowForSale.weight} lbs.</p>
            </>
          ),
        }}
      />
      <CardActions>
        <Button
          {...{
            className: 'purchase',
            color: 'primary',
            disabled:
              cowValue > money ||
              cowInventory.length >=
                PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows,
            onClick: () => handleCowPurchaseClick(cowForSale),
            variant: 'contained',
          }}
        >
          Buy
        </Button>
      </CardActions>
    </Card>
    <h2>
      Cows ({cowInventory.length} /{' '}
      {PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows})
    </h2>
  </div>
);

CowPenContextMenu.propTypes = {
  cowForSale: object.isRequired,
  cowInventory: array.isRequired,
  handleCowPurchaseClick: func.isRequired,
  money: number.isRequired,
  purchasedCowPen: number.isRequired,
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
