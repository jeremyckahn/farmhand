import React from 'react';

import FarmhandContext from '../../Farmhand.context';

import './Recipe.sass';

const Recipe = () => <div className="Recipe"></div>;

Recipe.propTypes = {};

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
