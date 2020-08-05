import React from 'react'
import { bool, func, number, object, string } from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import {
  getCropLifeStage,
  getCropLifecycleDuration,
  getPlotContentType,
  getPlotImage,
  isMouseHeldDown,
} from '../../utils'
import { itemsMap } from '../../data/maps'
import { pixel, plotStates } from '../../img'
import { cropLifeStage, itemType } from '../../enums'
import { FERTILIZER_BONUS } from '../../constants'
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

export const getDaysLeftToMature = plotContent => {
  const item = plotContent ? itemsMap[plotContent.itemId] : null

  // Need to check that daysWatered is > -1 here because it may be NaN (in the
  // case of non-crop items).
  if (!(plotContent && plotContent.daysWatered > -1)) {
    return null
  }

  const daysUntilLifecycleDuration =
    getCropLifecycleDuration(item) - plotContent.daysWatered

  return Math.max(
    0,
    daysUntilLifecycleDuration > 0 && daysUntilLifecycleDuration < 1
      ? 1
      : Math.ceil(
          daysUntilLifecycleDuration /
            (plotContent.isFertilized ? 1 + FERTILIZER_BONUS : 1)
        )
  )
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
  const item = plotContent ? itemsMap[plotContent.itemId] : null
  const daysLeftToMature = getDaysLeftToMature(plotContent)

  const plot = (
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

          'is-replantable': plotContent && item.isReplantable,
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

  return plotContent ? (
    <Tooltip
      {...{
        arrow: true,
        placement: 'top',
        title: (
          <>
            <Typography>{item.name}</Typography>
            {getPlotContentType(plotContent) === itemType.CROP && (
              <Typography>
                {daysLeftToMature
                  ? `Days of watering to mature: ${daysLeftToMature}`
                  : 'Ready to harvest!'}
              </Typography>
            )}
          </>
        ),
      }}
    >
      {plot}
    </Tooltip>
  ) : (
    plot
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
