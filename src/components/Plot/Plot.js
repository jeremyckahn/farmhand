import React from 'react';
import { func, number, object, shape, string } from 'prop-types';
import { items as itemImages, pixel, wateredPlot } from '../../img';
import './Plot.sass';

// TODO: The semantics in this component suggest it is dealing with a
// farmhand.item, but it is actually a farmhand.crop. Update the semantics to
// be correct.

export const Plot = ({
  handlers: { handlePlotClick },
  image,
  item,
  x,
  y,
  state,
}) => (
  <div
    className="Plot"
    style={{
      backgroundImage: `url(${item && item.wasWateredToday && wateredPlot})`,
    }}
    onClick={() => handlePlotClick(x, y)}
  >
    <img
      className="square"
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
