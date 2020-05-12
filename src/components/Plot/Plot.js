import React from 'react'
import { array, arrayOf, func, number, object, string } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import { getCropLifeStage, getPlotContentType, getPlotImage } from '../../utils'
import { itemsMap } from '../../data/maps'
import { pixel, plotStates } from '../../img'
import { cropLifeStage, itemType } from '../../enums'
import './Plot.sass'

export const getBackgroundStyles = plotContent => {
  if (!plotContent) {
    return null
  }

  const backgroundImages = []

  if (plotContent.isFertilized) {
    backgroundImages.push(`url(${plotStates['fertilized-plot']})`)
  }

  if (plotContent.wasWateredToday) {
    backgroundImages.push(`url(${plotStates['watered-plot']})`)
  }

  return backgroundImages.join(', ')
}

export const isInRange = (range, testX, testY) => {
  const rangeHeight = range.length
  const rangeWidth = range[0].length
  const [topLeft] = range[0]
  const bottomRight = range[rangeHeight - 1][rangeWidth - 1]

  return (
    // topLeft will be falsy if the range is empty
    !!topLeft &&
    testX >= topLeft.x &&
    testX <= bottomRight.x &&
    testY >= topLeft.y &&
    testY <= bottomRight.y
  )
}

export const Plot = ({
  handlePlotClick,
  handlePlotMouseOver,
  hoveredPlotRange,
  plotContent,
  x,
  y,

  image = getPlotImage(plotContent),
  lifeStage = plotContent &&
    getPlotContentType(plotContent) === itemType.CROP &&
    getCropLifeStage(plotContent),
}) => (
  <div
    className={classNames('Plot', {
      'is-empty': !plotContent,
      'is-in-hover-range': isInRange(hoveredPlotRange, x, y),

      // For crops
      crop: plotContent && getPlotContentType(plotContent) === itemType.CROP,
      'is-fertilized': plotContent && plotContent.isFertilized,
      'is-ripe': lifeStage === cropLifeStage.GROWN,

      'is-replantable':
        plotContent && itemsMap[plotContent.itemId].isReplantable,
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
)

Plot.propTypes = {
  handlePlotClick: func.isRequired,
  handlePlotMouseOver: func.isRequired,
  hoveredPlotRange: arrayOf(array).isRequired,
  lifeStage: string,
  plotContent: object,
  x: number.isRequired,
  y: number.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Plot {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
