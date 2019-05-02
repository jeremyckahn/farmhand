import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { func, shape } from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import './DebugMenu.sass';

export const DebugMenu = ({
  handlers: { handleClearPersistedDataClick, handleWaterAllPlotsClick },
}) => (
  <ExpansionPanel className="DebugMenu" style={{ position: 'absolute' }}>
    <ExpansionPanelSummary>
      <h2>Debug Menu</h2>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Typography>
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
          Clear data (shift + c)
        </Button>
      </Typography>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

DebugMenu.propTypes = {
  handlers: shape({
    handleClearPersistedDataClick: func.isRequired,
    handleWaterAllPlotsClick: func.isRequired,
  }).isRequired,
};

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {context => <DebugMenu {...context} />}
    </FarmhandContext.Consumer>
  );
}
