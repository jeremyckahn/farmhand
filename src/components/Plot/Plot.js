import React from 'react';
import { func, number, object, shape } from 'prop-types';
import './Plot.css';

import pixel from '../../img/pixel.png';

export const Plot = ({ handlers: { handlePlotClick }, x, y, state }) => (
  <div className="Plot" onClick={() => handlePlotClick(x, y)}>
    <img src={pixel} alt="TODO: Place explanatory text here" />
  </div>
);

Plot.propTypes = {
  handlers: shape({
    handlePlotClick: func.isRequired,
  }).isRequired,
  x: number.isRequired,
  y: number.isRequired,
  state: object.isRequired,
};

export default Plot;
