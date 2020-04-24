import React from 'react';
import { object } from 'prop-types';

import { recipesMap } from '../../data/maps';
import Recipe from '../Recipe';

import FarmhandContext from '../../Farmhand.context';

import './Kitchen.sass';

const Kitchen = ({ learnedRecipes }) => (
  <div className="Kitchen">
    <h2>Learned Recipes</h2>
    <section>
      <ul className="card-list">
        {Object.keys(learnedRecipes).map(recipeId => (
          <li key={recipeId}>
            <Recipe
              {...{
                recipe: recipesMap[recipeId],
              }}
            />
          </li>
        ))}
      </ul>
    </section>
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
