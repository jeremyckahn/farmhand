import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { object } from 'prop-types';

import { dishes } from '../../img';

import FarmhandContext from '../../Farmhand.context';

import './Recipe.sass';

const Recipe = ({ recipe: { id, name } }) => (
  <Card {...{ className: 'Recipe' }}>
    <CardHeader
      {...{
        avatar: <img {...{ src: dishes[id], alt: name }} />,
        title: name,
      }}
    />
    <CardActions></CardActions>
  </Card>
);

Recipe.propTypes = {
  recipe: object.isRequired,
};

// export default Recipe;
export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Recipe {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
