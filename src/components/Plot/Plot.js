import React from 'react'
import { bool, func, number, object, string } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import { getCropLifeStage, getPlotContentType, getPlotImage } from '../../utils'
import { itemsMap } from '../../data/maps'
import { pixel, plotStates } from '../../img'
import { cropLifeStage, itemType } from '../../enums'
import { isMouseHeldDown } from '../../utils'
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

export const Plot = ({
  handlePlotClick,
  hoveredPlot,
  hoveredPlotRangeSize,
  isInHoverRange,
  plotContent,
  setHoveredPlot,
  x,
  y,

  image = getPlotImage(plotContent),
  lifeStage = plotContent &&
    getPlotContentType(plotContent) === itemType.CROP &&
    getCropLifeStage(plotContent),
  isRipe = lifeStage === cropLifeStage.GROWN,
}) => {
  return (
    <div
      {...{
        className: classNames('Plot', {
          'is-empty': !plotContent,
          'is-in-hover-range': isInHoverRange,

          // For crops
          crop:
            plotContent && getPlotContentType(plotContent) === itemType.CROP,
          'is-fertilized': plotContent && plotContent.isFertilized,
          'is-ripe': isRipe,

          'is-replantable':
            plotContent && itemsMap[plotContent.itemId].isReplantable,
        }),
        style: {
          backgroundImage: getBackgroundStyles(plotContent),
        },
        onClick: () => handlePlotClick(x, y),
        onMouseEnter: () => {
          if (isMouseHeldDown()) {
            handlePlotClick(x, y)
          }
        },
        onMouseOver: () => setHoveredPlot({ x, y }),
      }}
    >
      <img
        {...{
          className: classNames('square', {
            animated: isRipe,
            heartBeat: isRipe,
          }),
          style: {
            backgroundImage: image ? `url(${image})` : undefined,
          },
          src: pixel,
          alt: '',
        }}
      />
    </div>
  )
}

Plot.propTypes = {
  handlePlotClick: func.isRequired,
  hoveredPlot: object.isRequired,
  hoveredPlotRangeSize: number.isRequired,
  isInHoverRange: bool.isRequired,
  lifeStage: string,
  plotContent: object,
  setHoveredPlot: func.isRequired,
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
