import React from 'react';
import {
  array,
  arrayOf,
  func,
  number,
  object,
  shape,
  string,
} from 'prop-types';
import { getCropLifeStage, getPlotImage } from '../../utils';
import { pixel, plotStates } from '../../img';
import { cropLifeStage, plotContentType } from '../../enums';
import classNames from 'classnames';
import './Plot.sass';

export const getBackgroundStyles = plotContent => {
  if (!plotContent) {
    return null;
  }

  const backgroundImages = [];

  if (plotContent.isFertilized) {
    backgroundImages.push(`url(${plotStates['fertilized-plot']})`);
  }

  if (plotContent.wasWateredToday) {
    backgroundImages.push(`url(${plotStates['watered-plot']})`);
  }

  return backgroundImages.join(', ');
};

export const isInRange = (range, testX, testY) => {
  const rangeHeight = range.length;
  const rangeWidth = range[0].length;
  const [topLeft] = range[0];
  const bottomRight = range[rangeHeight - 1][rangeWidth - 1];

  return (
    // topLeft will be falsy if the range is empty
    !!topLeft &&
    testX >= topLeft.x &&
    testX <= bottomRight.x &&
    testY >= topLeft.y &&
    testY <= bottomRight.y
  );
};

export const Plot = ({
  handlers: { handlePlotClick, handlePlotMouseOver },
  hoveredPlotRange,
  plotContent,
  x,
  y,
  state,

  image = getPlotImage(plotContent),
  lifeStage = plotContent &&
    plotContent.type === plotContentType.CROP &&
    getCropLifeStage(plotContent),
}) => (
  <div
    className={classNames('Plot', {
      'is-empty': !plotContent,
      'is-in-hover-range': isInRange(hoveredPlotRange, x, y),

      // For crops
      crop: plotContent && plotContent.type === plotContentType.CROP,
      'is-fertilized': plotContent && plotContent.isFertilized,
      'is-ripe': lifeStage === cropLifeStage.GROWN,

      sprinkler: plotContent && plotContent.type === plotContentType.SPRINKLER,
    })}
    style={{
      backgroundImage: getBackgroundStyles(plotContent),
    }}
    onClick={() => handlePlotClick(x, y)}
    onMouseOver={() => handlePlotMouseOver(x, y)}
  >
    <img
      className="square"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
      }}
      src={pixel}
      alt=""
    />
  </div>
);

Plot.propTypes = {
  handlers: shape({
    handlePlotClick: func.isRequired,
    handlePlotMouseOver: func.isRequired,
  }).isRequired,
  hoveredPlotRange: arrayOf(array),
  lifeStage: string,
  plotContent: object,
  state: object.isRequired,
  x: number.isRequired,
  y: number.isRequired,
};

export default Plot;
