import React from 'react';
import { object } from 'prop-types';
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
import './CowPenContextMenu.sass';

const genderIcons = {
  [genders.MALE]: <FontAwesomeIcon icon={faMars} />,
  [genders.FEMALE]: <FontAwesomeIcon icon={faVenus} />,
  [genders.NONBINARY]: <FontAwesomeIcon icon={faGenderless} />,
};

export const CowPenContextMenu = ({ cowForSale }) => (
  <div className="CowPenContextMenu">
    <h2>Available for purchase</h2>
    <Card>
      <CardHeader
        {...{
          avatar: <img {...{ src: animals.cow.white }} alt="Cow" />,
          title: (
            <p>
              {cowForSale.name} {genderIcons[cowForSale.gender]}
            </p>
          ),
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
