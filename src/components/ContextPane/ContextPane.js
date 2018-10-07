import React from 'react';
import { string } from 'prop-types';
import { stageFocusType } from '../../enums';

import './ContextPane.css';

const ContextPane = ({ stageFocus }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.FIELD && <div className="plantable-items" />}
  </div>
);

ContextPane.propTypes = {
  stageFocus: string.isRequired,
};

export default ContextPane;
