import React from 'react';
import { func, number, object, shape, string } from 'prop-types';
import { pixel, fertilizedPlot, wateredPlot } from '../../img';
import { cropLifeStage } from '../../enums';
import classNames from 'classnames';
import './Plot.sass';

export const getBackgroundStyles = crop => {
  if (!crop) {
    return null;
  }

  const backgroundImages = [];

  if (crop.isFertilized) {
    backgroundImages.push(`url(${fertilizedPlot})`);
  }

  if (crop.wasWateredToday) {
    backgroundImages.push(`url(${wateredPlot})`);
  }

  return backgroundImages.join(', ');
};

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
      'is-fertilized': crop && crop.isFertilized,
      ripe: lifeStage === cropLifeStage.GROWN,
    })}
    style={{
      backgroundImage: getBackgroundStyles(crop),
    }}
    onClick={() => handlePlotClick(x, y)}
  >
    <img
      className="square"
      style={{
        backgroundImage: `url(${image || pixel})`,
      }}
      src={pixel}
      alt=""
    />
  </div>
);

Plot.propTypes = {
  handlers: shape({
    handlePlotClick: func.isRequired,
  }).isRequired,
  image: string,
  lifeStage: string,
  crop: object,
  x: number.isRequired,
  y: number.isRequired,
  state: object.isRequired,
};

export default Plot;
