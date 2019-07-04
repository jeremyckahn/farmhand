import React from 'react';
import { object } from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';

import { animals } from '../../img';
import FarmhandContext from '../../Farmhand.context';
import './CowPenContextMenu.sass';

export const CowPenContextMenu = ({ cowForSale }) => (
  <div className="CowPenContextMenu">
    <h2>Available for purchase</h2>
    <Card>
      <CardHeader
        {...{
          avatar: <img {...{ src: animals.cow.white }} alt="Cow" />,
          title: cowForSale.name,
          subheader: <p>{cowForSale.weight} lbs.</p>,
        }}
      />
      <CardActions />
    </Card>
  </div>
);

CowPenContextMenu.propTypes = {
  cowForSale: object.isRequired,
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
