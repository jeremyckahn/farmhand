import React from 'react';
import { func, number } from 'prop-types';
import './Plot.css';

import pixel from '../../img/pixel.png';

export const Plot = ({ handlePlotClick, x, y }) => (
  <div className="Plot" onClick={() => handlePlotClick(x, y)}>
    <img src={pixel} alt="TODO: Place explanatory text here" />
  </div>
);

Plot.propTypes = {
  handlePlotClick: func.isRequired,
  x: number.isRequired,
  y: number.isRequired,
};

export default Plot;
