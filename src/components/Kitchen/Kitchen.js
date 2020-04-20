import React from 'react';
import { object } from 'prop-types';

import { recipesMap } from '../../data/maps';
import Recipe from '../Recipe';

import FarmhandContext from '../../Farmhand.context';

import './Kitchen.sass';

const Kitchen = ({ learnedRecipes }) => (
  <div className="Kitchen">
    {Object.keys(learnedRecipes).map(recipeId => (
      <Recipe
        {...{
          key: recipeId,
          recipe: recipesMap[recipeId],
        }}
      />
    ))}
  </div>
);

Kitchen.propTypes = {
  learnedRecipes: object.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Kitchen {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
