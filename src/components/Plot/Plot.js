import React from 'react';
import { func, number, object, shape, string } from 'prop-types';
import { items as itemImages } from '../../img';
import './Plot.sass';

import pixel from '../../img/pixel.png';

export const Plot = ({
  handlers: { handlePlotClick },
  image,
  item,
  x,
  y,
  state,
}) => (
  <div className="Plot" onClick={() => handlePlotClick(x, y)}>
    <img
      style={{
        backgroundImage: `url(${image ||
          (item ? itemImages[item.itemId] : pixel)})`,
      }}
      src={pixel}
      alt="TODO: Place explanatory text here"
    />
  </div>
);

Plot.propTypes = {
  handlers: shape({
    handlePlotClick: func.isRequired,
  }).isRequired,
  image: string,
  item: object,
  x: number.isRequired,
  y: number.isRequired,
  state: object.isRequired,
};

export default Plot;
