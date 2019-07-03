import React from 'react';

import FarmhandContext from '../../Farmhand.context';
import './CowPenContextMenu.sass';

export const CowPenContextMenu = () => <div className="CowPenContextMenu" />;

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowPenContextMenu {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  );
}
