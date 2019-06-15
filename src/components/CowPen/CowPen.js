import React from 'react';

import FarmhandContext from '../../Farmhand.context';

import './CowPen.sass';

export const CowPen = () => <div className="CowPen" />;

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowPen {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
