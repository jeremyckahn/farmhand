import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { itemsMap } from '../../data/maps.js'
import forestPlotDefaultImg from '../../img/plot-states/forest-plot-default.png'
import { getChopWoodYieldRange } from '../../utils/getChopWoodYieldRange.js'
import { getForestFruitImage } from '../../utils/getForestFruitImage.js'
import { getForestPlotImage } from '../../utils/getForestPlotImage.js'
import { getFruitLifeStage } from '../../utils/getFruitLifeStage.js'
import { getTreeLifeStage } from '../../utils/getTreeLifeStage.js'
import { isPlantedTree } from '../../utils/isPlantedTree.js'
import {
  cropLifeStage,
  fieldMode as fieldModeEnum,
  toolType,
} from '../../enums.js'
import { Div } from '../Elements/index.js'

const { GROWN } = cropLifeStage
const { CHOP } = fieldModeEnum

const colorGenericHighlight = 'rgba(255, 255, 255, 0.8)'
const colorGreenOk = 'rgba(0, 255, 0, 0.5)'
const colorRedDestructive = 'rgba(255, 0, 0, 0.5)'

const getTreeTooltipText = (
  treeLifeStage: farmhand.cropLifeStage,
  fruitLifeStage: farmhand.cropLifeStage
): string => {
  if (treeLifeStage !== GROWN) {
    return 'Growing...'
  }

  return fruitLifeStage === GROWN ? 'Ready to pick!' : 'Fruiting...'
}

const formatWoodRange = ([min, max]: [number, number]): string =>
  min === max ? `${min}` : `${min}-${max}`

const getChopActionText = (willAlsoPickFruit: boolean): string =>
  willAlsoPickFruit ? 'Pick and Chop (destroy)' : 'Chop (destroy)'

const getChopYieldText = (
  woodRange: [number, number] | null,
  fruitBonusItemName: string | null
): string => {
  if (!woodRange) {
    return ''
  }

  const woodItemName = (itemsMap.wood?.name ?? 'Wood').toLowerCase()
  const woodText = `${formatWoodRange(woodRange)} ${woodItemName}`

  return fruitBonusItemName ? `${woodText}, 1 ${fruitBonusItemName}` : woodText
}

export interface ForestPlotProps {
  fieldMode: farmhand.fieldMode
  plotContent: farmhand.plantedTree | farmhand.forestForageable | null
  handleForestPlotClick: (x: number, y: number) => void
  toolLevels: Record<farmhand.toolType, farmhand.toolLevel>
  x: number
  y: number
}

export const ForestPlot = ({
  fieldMode,
  plotContent,
  handleForestPlotClick,
  toolLevels,
  x,
  y,
}: ForestPlotProps) => {
  const isTree = isPlantedTree(plotContent)
  const treeLifeStage = isTree ? getTreeLifeStage(plotContent) : null
  const fruitLifeStage = isTree ? getFruitLifeStage(plotContent) : null
  const canBeHarvested = fruitLifeStage === GROWN
  const canBeChopped = isTree && fieldMode === CHOP
  const item = isTree ? itemsMap[plotContent.itemId] : null
  const treeImage = isTree ? getForestPlotImage(plotContent) : null
  const fruitImage = isTree ? getForestFruitImage(plotContent) : null
  const chopWoodRange = canBeChopped
    ? getChopWoodYieldRange(toolLevels?.[toolType.AXE], treeLifeStage === GROWN)
    : null

  const plot = (
    <Div
      {...{
        className: classNames('ForestPlot', {
          'is-empty': !plotContent,
          'can-be-harvested': canBeHarvested,
          'can-be-chopped': canBeChopped,
        }),
        style: { gridColumn: x + 1, gridRow: y + 1 },
        onClick: () => handleForestPlotClick(x, y),
      }}
      sx={{
        backgroundImage: `url(${forestPlotDefaultImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        border: 'solid 1px #000',
        height: 'auto',
        imageRendering: 'pixelated',
        overflow: 'visible',
        position: 'relative',
        width: '100%',
        aspectRatio: '1',
        '&:hover': {
          backgroundColor: colorGenericHighlight,
          cursor: 'pointer',
        },
        '&.can-be-harvested:hover': {
          backgroundColor: colorGreenOk,
        },
        // The axe is destructive - it removes the tree regardless of its
        // growth stage - so this takes priority over the (potentially also
        // true) can-be-harvested green hover.
        '&.can-be-chopped:hover': {
          backgroundColor: colorRedDestructive,
        },
      }}
    >
      {isTree && (
        <>
          {/* A tree's sprite is anchored near the base of its plot (not
          flush with the bottom edge, so the trunk doesn't look like it's
          standing on the very lip of the tile), and its box is twice as
          tall as it is wide (matching the apple-tree art's own 1:2 canvas)
          so it visually pokes up into the plot(s) above it instead of
          being boxed in like a Field crop. The box size never changes -
          growth comes from swapping in a bigger tree within that same
          canvas.

          The sprite's width always matches the plot's own width exactly
          (it never grows sideways, unlike an earlier version of this that
          scaled width too), so nesting it inside its own plot is safe:
          there's no horizontal bleed for a neighboring plot's opaque
          background to clip. Vertical bleed into the row above paints
          correctly because a lower row's plot (and its sprite) is later in
          DOM order than the row above. */}
          <Div
            {...{
              'aria-hidden': true,
              className: 'ForestTreeSprite',
              style: {
                backgroundImage: treeImage ? `url(${treeImage})` : undefined,
              },
            }}
            sx={{
              backgroundPosition: 'bottom center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              bottom: '50%',
              imageRendering: 'pixelated',
              left: 0,
              pointerEvents: 'none',
              position: 'absolute',
              width: '100%',
              aspectRatio: '1 / 2',
            }}
          />
          {fruitImage && (
            <Div
              {...{
                'aria-hidden': true,
                className: classNames('ForestTreeSprite', {
                  ...(canBeHarvested && { animated: true, heartBeat: true }),
                }),
                style: { backgroundImage: `url(${fruitImage})` },
              }}
              sx={{
                backgroundPosition: 'bottom center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                bottom: '50%',
                imageRendering: 'pixelated',
                left: 0,
                pointerEvents: 'none',
                position: 'absolute',
                width: '100%',
                aspectRatio: '1 / 2',
              }}
            />
          )}
        </>
      )}
    </Div>
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
            {item ? <Typography>{item.name} Tree</Typography> : null}
            {isTree &&
              treeLifeStage &&
              fruitLifeStage &&
              (canBeChopped ? (
                <>
                  <Typography>{getChopActionText(canBeHarvested)}</Typography>
                  <Typography>
                    {getChopYieldText(
                      chopWoodRange,
                      canBeHarvested ? item?.name ?? null : null
                    )}
                  </Typography>
                </>
              ) : (
                <Typography>
                  {getTreeTooltipText(treeLifeStage, fruitLifeStage)}
                </Typography>
              ))}
          </>
        ),
      }}
    >
      {plot}
    </Tooltip>
  )
}

export default function Consumer(props: Partial<ForestPlotProps>) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <ForestPlot
          {...({ ...gameState, ...handlers, ...props } as ForestPlotProps)}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
