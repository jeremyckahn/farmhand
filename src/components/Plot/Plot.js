import React from 'react'
import { bool, func, number, object, string } from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context'
import {
  getCropLifeStage,
  getCropLifecycleDuration,
  getPlotContentType,
  getPlotImage,
} from '../../utils'
import { itemsMap } from '../../data/maps'
import { pixel, plotStates } from '../../img'
import { cropLifeStage, fertilizerType, itemType } from '../../enums'
import { FERTILIZER_BONUS } from '../../constants'

import { SHOVELED } from '../../strings'

import './Plot.sass'

export const getBackgroundStyles = plotContent => {
  if (!plotContent) {
    return null
  }

  const backgroundImages = []

  if (plotContent.fertilizerType === fertilizerType.STANDARD) {
    backgroundImages.push(`url(${plotStates['fertilized-plot']})`)
  } else if (plotContent.fertilizerType === fertilizerType.RAINBOW) {
    backgroundImages.push(`url(${plotStates['rainbow-fertilized-plot']})`)
  }

  if (plotContent.wasWateredToday) {
    backgroundImages.push(`url(${plotStates['watered-plot']})`)
  } else if (plotContent.isShoveled) {
    backgroundImages.push(`url(${plotStates['shoveled-plot']})`)
  }

  return backgroundImages.join(', ')
}

/*!
 * @param {(farmhand.plotContent|farmhand.crop)?} plotContent
 * @returns {number?}
 */
export const getDaysLeftToMature = plotContent =>
  // Need to check that daysWatered is > -1 here because it may be NaN (in the
  // case of non-crop items).
  plotContent && plotContent.daysWatered > -1
    ? Math.max(
        0,
        Math.ceil(
          (getCropLifecycleDuration(
            plotContent ? itemsMap[plotContent.itemId] : null
          ) -
            plotContent.daysWatered) /
            (1 +
              (plotContent.fertilizerType === fertilizerType.NONE
                ? 0
                : FERTILIZER_BONUS))
        )
      )
    : null

export const Plot = ({
  handlePlotClick,
  isInHoverRange,
  plotContent,
  selectedItemId,
  setHoveredPlot,
  x,
  y,

  image = getPlotImage(plotContent, x, y),
  lifeStage = plotContent &&
    getPlotContentType(plotContent) === itemType.CROP &&
    getCropLifeStage(plotContent),
  isRipe = lifeStage === cropLifeStage.GROWN ||
    (plotContent && getPlotContentType(plotContent) === itemType.WEED),
}) => {
  const item = plotContent ? itemsMap[plotContent.itemId] : null
  const daysLeftToMature = getDaysLeftToMature(plotContent)
  const isCrop =
    plotContent && getPlotContentType(plotContent) === itemType.CROP
  const isScarecow = itemsMap[plotContent?.itemId]?.type === itemType.SCARECROW

  let wasJustShoveled = false
  if (plotContent && plotContent.wasJustShoveled) {
    wasJustShoveled = true
  }

  const showPlotImage = Boolean(
    image &&
      (wasJustShoveled ||
        plotContent.itemId ||
        getPlotContentType(plotContent) === itemType.CROP)
  )

  const plot = (
    <div
      {...{
        className: classNames('Plot', {
          'is-empty': !plotContent,
          'is-in-hover-range': isInHoverRange,

          // For crops
          crop: isCrop,
          'is-ripe': isRipe,

          // For crops and scarecrows
          'can-be-fertilized':
            (isCrop && plotContent.fertilizerType === fertilizerType.NONE) ||
            (isScarecow &&
              plotContent.fertilizerType === fertilizerType.NONE &&
              selectedItemId === 'rainbow-fertilizer'),

          'can-be-mined': !plotContent,

          // For scarecrows and sprinklers
          'is-replantable': plotContent && item?.isReplantable,
        }),
        style: {
          backgroundImage: getBackgroundStyles(plotContent),
        },
        onClick: () => handlePlotClick(x, y),
        onMouseOver: () => setHoveredPlot({ x, y }),
      }}
    >
      <img
        {...{
          className: classNames('square', {
            animated: wasJustShoveled || (isCrop && isRipe),
            heartBeat: isCrop && isRipe,
            'was-just-shoveled': wasJustShoveled,
          }),
          style: {
            backgroundImage: showPlotImage ? `url(${image})` : undefined,
          },
          src: pixel,
          alt: itemsMap[plotContent?.itemId ?? plotContent?.oreId]?.name || '',
        }}
      />
    </div>
  )

  let tooltipContents = null
  if (item) {
    tooltipContents = item.name
  } else if (plotContent?.isShoveled) {
    tooltipContents = SHOVELED
  }

  if (!plotContent) {
    return plot
  }

  return (
    <Tooltip
      {...{
        arrow: true,
        placement: 'top',
        title: (
          <>
            {tooltipContents ? (
              <Typography>{tooltipContents}</Typography>
            ) : null}
            {isCrop && (
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
  )
}

Plot.propTypes = {
  handlePlotClick: func.isRequired,
  isInHoverRange: bool.isRequired,
  lifeStage: string,
  plotContent: object,
  selectedItemId: string.isRequired,
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
