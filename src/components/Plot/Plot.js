/** @typedef {import("../../index").farmhand.item} farmhand.item */
/** @typedef {import("../../index").farmhand.plotContent} farmhand.plotContent */

import React, { useEffect, useState } from 'react'
import { bool, func, number, object, string } from 'prop-types'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context'
import { getCropLifeStage, getPlotContentType, getPlotImage } from '../../utils'
import { getCropLifecycleDuration } from '../../utils/getCropLifecycleDuration'
import { itemsMap, cropItemIdToSeedItemMap } from '../../data/maps'
import { pixel, plotStates } from '../../img'
import { cropLifeStage, fertilizerType, itemType } from '../../enums'
import { FERTILIZER_BONUS } from '../../constants'

import { SHOVELED } from '../../strings'

import './Plot.sass'
import { SHOVELED_PLOT } from '../../templates'

/**
 * @param {farmhand.plotContent?} plotContent
 * @returns {string}
 */
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
  canBeHarvested = lifeStage === cropLifeStage.GROWN ||
    (plotContent && getPlotContentType(plotContent) === itemType.WEED),
}) => {
  const item = plotContent ? itemsMap[plotContent.itemId] : null
  const daysLeftToMature = getDaysLeftToMature(plotContent)
  const isCrop =
    plotContent && getPlotContentType(plotContent) === itemType.CROP
  const isScarecow = itemsMap[plotContent?.itemId]?.type === itemType.SCARECROW
  const [wasJustShoveled, setWasJustShoveled] = useState(false)
  const [initialIsShoveledState, setInitialIsShoveledState] = useState(
    Boolean(plotContent?.isShoveled)
  )

  useEffect(() => {
    if (
      !initialIsShoveledState &&
      plotContent?.isShoveled &&
      plotContent?.oreId
    ) {
      setWasJustShoveled(true)
    }
  }, [initialIsShoveledState, plotContent])

  useEffect(() => {
    if (plotContent === null) {
      setInitialIsShoveledState(false)
      setWasJustShoveled(false)
    }
  }, [plotContent])

  const showPlotImage = Boolean(
    image &&
      (wasJustShoveled ||
        plotContent.itemId ||
        getPlotContentType(plotContent) === itemType.CROP)
  )

  let plotLabelText = null
  if (item) {
    const isPlotContentACropSeed =
      item.type === itemType.CROP &&
      getCropLifeStage(plotContent) === cropLifeStage.SEED

    const seedItem = cropItemIdToSeedItemMap[item.id]
    plotLabelText = isPlotContentACropSeed ? seedItem.name : item.name
  } else if (wasJustShoveled || plotContent?.isShoveled) {
    const oreItem = itemsMap[plotContent?.oreId]

    plotLabelText = oreItem ? SHOVELED_PLOT`${oreItem}` : SHOVELED
  }

  const plot = (
    <div
      {...{
        className: classNames('Plot', {
          'is-empty': !plotContent,
          'is-in-hover-range': isInHoverRange,

          // For crops
          crop: isCrop,
          'can-be-harvested': canBeHarvested,

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
            ...(isCrop && {
              animated: canBeHarvested,
              heartBeat: canBeHarvested,
            }),
            ...(wasJustShoveled && {
              animated: true,
              'was-just-shoveled': true,
            }),
          }),
          style: {
            backgroundImage: showPlotImage ? `url(${image})` : undefined,
          },
          src: pixel,
          alt: plotLabelText ?? 'Empty plot',
        }}
      />
    </div>
  )

  if (!plotContent) {
    return plot
  }

  return (
    <Tooltip
      followCursor
      {...{
        placement: 'top',
        title: (
          <>
            {plotLabelText ? <Typography>{plotLabelText}</Typography> : null}
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
