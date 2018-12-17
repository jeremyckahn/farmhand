import React from 'react';
import { func, number, object, shape, string } from 'prop-types';
import { items as itemImages, pixel, wateredPlot } from '../../img';
import { cropLifeStage } from '../../enums';
import classNames from 'classnames';
import './Plot.sass';

export const Plot = ({
  handlers: { handlePlotClick },
  image,
  lifeStage,
  crop,
  x,
  y,
  state,
}) => (
  <div
    className={classNames('Plot', {
      crop: !!crop,
      ripe: lifeStage === cropLifeStage.GROWN,
    })}
    style={{
      backgroundImage: `url(${crop && crop.wasWateredToday && wateredPlot})`,
    }}
    onClick={() => handlePlotClick(x, y)}
  >
    <img
      className="square"
      style={{
        backgroundImage: `url(${image ||
          (crop ? itemImages[crop.itemId] : pixel)})`,
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
  lifeStage: string.isRequired,
  crop: object,
  x: number.isRequired,
  y: number.isRequired,
  state: object.isRequired,
};

export default Plot;
