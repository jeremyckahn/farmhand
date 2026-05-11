import React, { useEffect, useState } from 'react'
import { bool, func, number, object, string } from 'prop-types'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import {
  getCropLifeStage,
  getPlotContentType,
  getPlotImage,
} from '../../utils/index.js'
import { getCropLifecycleDuration } from '../../utils/getCropLifecycleDuration.js'
import { itemsMap, cropItemIdToSeedItemMap } from '../../data/maps.js'
import { pixel, plotStates } from '../../img/index.js'
import { cropLifeStage, fertilizerType, itemType } from '../../enums.js'
import { FERTILIZER_BONUS } from '../../constants.js'

import { SHOVELED } from '../../strings.js'

import './Plot.sass'
import { SHOVELED_PLOT } from '../../templates.js'

export const getBackgroundStyles = (
  plotContent: farmhand.plotContent | null
): string | undefined => {
  if (!plotContent) {
    return undefined
  }

  const backgroundImages: string[] = []

  if (plotContent.fertilizerType === fertilizerType.STANDARD) {
    backgroundImages.push(`url(${plotStates['fertilized-plot']})`)
  } else if (plotContent.fertilizerType === fertilizerType.RAINBOW) {
    backgroundImages.push(`url(${plotStates['rainbow-fertilized-plot']})`)
  }

  if ('wasWateredToday' in plotContent && plotContent.wasWateredToday) {
    backgroundImages.push(`url(${plotStates['watered-plot']})`)
  } else if ('isShoveled' in plotContent && plotContent.isShoveled) {
    backgroundImages.push(`url(${plotStates['shoveled-plot']})`)
  }

  return backgroundImages.length > 0 ? backgroundImages.join(', ') : undefined
}

/*!
 */
export const getDaysLeftToMature = (
  plotContent: farmhand.plotContent | farmhand.crop | null
): number | null =>
  // Need to check that daysWatered is > -1 here because it may be NaN (in the
  // case of non-crop items).
  plotContent &&
  (plotContent as any).daysWatered > -1 &&
  getPlotContentType(plotContent) === itemType.CROP
    ? Math.max(
        0,
        Math.ceil(
          (getCropLifecycleDuration(
            plotContent ? (itemsMap[plotContent.itemId] as any) : null
          ) -
            (plotContent as any).daysWatered) /
            (1 +
              (plotContent.fertilizerType === fertilizerType.NONE
                ? 0
                : FERTILIZER_BONUS))
        )
      )
    : null

export interface PlotProps {
  handlePlotClick: (x: number, y: number) => void
  isInHoverRange: boolean
  plotContent: farmhand.plotContent | null
  selectedItemId: string
  setHoveredPlot: (coords: { x: number; y: number } | null) => void
  x: number
  y: number
  image?: string
  lifeStage?: string
  canBeHarvested?: boolean
}

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
}: any) => {
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

  let plotLabelText: string | null = null
  if (item) {
    const isPlotContentACropSeed =
      item.type === itemType.CROP &&
      getCropLifeStage(plotContent) === cropLifeStage.SEED

    const seedItem = cropItemIdToSeedItemMap[item.id]
    plotLabelText = isPlotContentACropSeed ? seedItem.name : item.name
  } else if (wasJustShoveled || plotContent?.isShoveled) {
    const oreItem = itemsMap[plotContent?.oreId]

    plotLabelText = oreItem
      ? SHOVELED_PLOT('', oreItem as farmhand.item)
      : SHOVELED
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

export default function Consumer(props: any) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Plot {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
