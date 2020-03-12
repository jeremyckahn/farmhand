import React from 'react';

import FarmhandContext from '../../Farmhand.context';

import './Kitchen.sass';

const Kitchen = () => <div className="Kitchen"></div>;

Kitchen.propTypes = {};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Kitchen {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
