import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { itemsMap } from '../../data/maps.js'
import forestPlotDefaultImg from '../../img/plot-states/forest-plot-default.png'
import { getForestFruitImage } from '../../utils/getForestFruitImage.js'
import { getForestPlotImage } from '../../utils/getForestPlotImage.js'
import { getFruitLifeStage } from '../../utils/getFruitLifeStage.js'
import { getTreeLifeStage } from '../../utils/getTreeLifeStage.js'
import { isPlantedTree } from '../../utils/isPlantedTree.js'
import { cropLifeStage } from '../../enums.js'
import { Div } from '../Elements/index.js'

const { GROWN } = cropLifeStage

const colorGenericHighlight = 'rgba(255, 255, 255, 0.8)'
const colorGreenOk = 'rgba(0, 255, 0, 0.5)'

const getTreeTooltipText = (
  treeLifeStage: farmhand.cropLifeStage,
  fruitLifeStage: farmhand.cropLifeStage
): string => {
  if (treeLifeStage !== GROWN) {
    return 'Growing...'
  }

  return fruitLifeStage === GROWN ? 'Ready to pick!' : 'Fruiting...'
}

export interface ForestPlotProps {
  plotContent: farmhand.plantedTree | farmhand.forestForageable | null
  handleForestPlotClick: (x: number, y: number) => void
  x: number
  y: number
}

export const ForestPlot = ({
  plotContent,
  handleForestPlotClick,
  x,
  y,
}: ForestPlotProps) => {
  const isTree = isPlantedTree(plotContent)
  const treeLifeStage = isTree ? getTreeLifeStage(plotContent) : null
  const fruitLifeStage = isTree ? getFruitLifeStage(plotContent) : null
  const canBeHarvested = fruitLifeStage === GROWN
  const item = isTree ? itemsMap[plotContent.itemId] : null
  const treeImage = isTree ? getForestPlotImage(plotContent) : null
  const fruitImage = isTree ? getForestFruitImage(plotContent) : null

  const plot = (
    <Div
      {...{
        className: classNames('ForestPlot', {
          'is-empty': !plotContent,
          'can-be-harvested': canBeHarvested,
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
            {item ? <Typography>{item.name}</Typography> : null}
            {isTree && treeLifeStage && fruitLifeStage && (
              <Typography>
                {getTreeTooltipText(treeLifeStage, fruitLifeStage)}
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
