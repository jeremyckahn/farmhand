import React from 'react';
import { func } from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import FarmhandContext from '../../Farmhand.context';

import './DebugMenu.sass';

export const DebugMenu = ({
  handleAddMoneyClick,
  handleClearPersistedDataClick,
  handleWaterAllPlotsClick,
}) => (
  <ExpansionPanel className="DebugMenu" square={true}>
    <ExpansionPanelSummary>
      <h2>Debug Menu</h2>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Typography>
        <Button
          color="primary"
          onClick={() => handleAddMoneyClick(10000)}
          variant="contained"
        >
          Get $10,000
        </Button>
        <Button
          color="primary"
          onClick={handleWaterAllPlotsClick}
          variant="contained"
        >
          Water all plots (w)
        </Button>
        <Button
          color="primary"
          onClick={handleClearPersistedDataClick}
          variant="contained"
        >
          Clear data
        </Button>
      </Typography>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

DebugMenu.propTypes = {
  handleAddMoneyClick: func.isRequired,
  handleClearPersistedDataClick: func.isRequired,
  handleWaterAllPlotsClick: func.isRequired,
};

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <DebugMenu {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  );
}
