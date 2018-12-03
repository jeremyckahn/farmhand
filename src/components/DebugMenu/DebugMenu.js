import React from 'react';
import { func, shape } from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import './DebugMenu.sass';

const DebugMenu = ({ handlers: { handleWaterAllPlotsClick } }) => (
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
          Water all plots
        </Button>
      </Typography>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

DebugMenu.propTypes = {
  handlers: shape({
    handleWaterAllPlotsClick: func.isRequired,
  }).isRequired,
};

export default DebugMenu;
