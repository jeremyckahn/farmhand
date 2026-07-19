import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { itemsMap } from '../../data/maps.js'
import { plotStates } from '../../img/index.js'
import forestPlotDefaultImg from '../../img/plot-states/forest-plot-default.png'
import { getChopWoodYieldRange } from '../../utils/getChopWoodYieldRange.js'
import { getForestFruitImage } from '../../utils/getForestFruitImage.js'
import { getForestPlotImage } from '../../utils/getForestPlotImage.js'
import { getFruitLifeStage } from '../../utils/getFruitLifeStage.js'
import { getTreeLifeStage } from '../../utils/getTreeLifeStage.js'
import { isPlantedTree } from '../../utils/isPlantedTree.js'
import {
  cropLifeStage,
  fertilizerType as fertilizerTypeEnum,
  fieldMode as fieldModeEnum,
  toolType,
  treeLifeStage as treeLifeStageEnum,
} from '../../enums.js'
import { Div } from '../Elements/index.js'

const { GROWN } = cropLifeStage
const { DEAD } = treeLifeStageEnum
const { CHOP, HARVEST_FRUIT } = fieldModeEnum
const { NONE, STANDARD, RAINBOW } = fertilizerTypeEnum

// Mirrors Plot.tsx's getBackgroundStyles - a mulched tree gets a plot-tile
// overlay the same way a fertilized crop does, layered under the plot's
// own default background image (CSS multi-background: earlier entries
// paint on top).
const getForestPlotBackgroundImage = (
  fertilizerType: farmhand.fertilizerType | undefined
): string => {
  const overlay =
    fertilizerType === STANDARD
      ? plotStates['mulched-plot']
      : fertilizerType === RAINBOW
      ? plotStates['rainbow-mulched-plot']
      : null

  return [
    ...(overlay ? [`url(${overlay})`] : []),
    `url(${forestPlotDefaultImg})`,
  ].join(', ')
}

const colorGenericHighlight = 'rgba(255, 255, 255, 0.8)'
const colorGreenOk = 'rgba(0, 255, 0, 0.5)'
const colorYellowCaution = 'rgba(255, 220, 0, 0.5)'

const getTreeTooltipText = (
  treeLifeStage: farmhand.treeLifeStage,
  fruitLifeStage: farmhand.cropLifeStage,
  fertilizerType: farmhand.fertilizerType | undefined
): string => {
  if (treeLifeStage === DEAD) {
    return 'Dead'
  }

  const growthText =
    treeLifeStage !== GROWN
      ? 'Growing...'
      : fruitLifeStage === GROWN
      ? 'Ready to pick!'
      : 'Fruiting...'

  if (!fertilizerType || fertilizerType === NONE) {
    return growthText
  }

  const fertilizerLabel =
    fertilizerType === RAINBOW ? 'Rainbow Mulched' : 'Mulched'

  return `${growthText} (${fertilizerLabel})`
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
  const fruitLifeStage = isTree
    ? getFruitLifeStage(plotContent, treeLifeStage ?? undefined)
    : null
  // Whether the tree's fruit is ripe at all, independent of which tool is
  // currently selected - used for the "ready to pick" tooltip/animation and
  // for the axe's bonus-fruit chop text, neither of which care about the
  // picker pole being equipped.
  const isFruitRipe = fruitLifeStage === GROWN
  const canBeChopped = isTree && fieldMode === CHOP
  // Unlike ripeness itself, actually being able to click-to-harvest requires
  // the picker pole to be the active tool, mirroring how canBeChopped
  // requires the axe's CHOP mode to be active.
  const canBeHarvested = isFruitRipe && fieldMode === HARVEST_FRUIT
  const item = isTree ? itemsMap[plotContent.itemId] : null
  const treeImage = isTree ? getForestPlotImage(plotContent) : null
  const fruitImage = isTree ? getForestFruitImage(plotContent) : null
  const treeFertilizerType = isTree ? plotContent.fertilizerType : undefined
  // A dead tree yields the same full range as a living grown one - only a
  // sapling/still-growing tree gets the halved range (see chopForestPlot.ts).
  const chopWoodRange = canBeChopped
    ? getChopWoodYieldRange(
        toolLevels?.[toolType.AXE],
        treeLifeStage === GROWN || treeLifeStage === DEAD
      )
    : null
  // The tree/fruit sprites are DOM descendants of the plot Div below, which
  // has its own onClick calling the same handler - stopPropagation prevents
  // a click on the sprite from also bubbling up and firing it a second
  // time, which would double-chop/double-harvest a single click.
  const handleTreeSpriteClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    handleForestPlotClick(x, y)
  }

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
        backgroundImage: getForestPlotBackgroundImage(treeFertilizerType),
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        border: 'solid 1px #000',
        height: 'auto',
        imageRendering: 'pixelated',
        overflow: 'visible',
        position: 'relative',
        width: '100%',
        aspectRatio: '1',
        // Staggers alternating rows by half a plot-width so a tree's
        // overhanging canopy (see .ForestTreeSprite below) grows into a
        // different visual slot than "directly above," rather than
        // colliding with whatever's planted in the same column one row up.
        // A percentage translateX resolves against this element's own
        // width, so this needs no coordination with the grid's own sizing.
        transform: `translateX(${y % 2 === 0 ? '-50%' : '50%'})`,
        '&:hover': {
          backgroundColor: colorGenericHighlight,
          cursor: 'pointer',
        },
        // Matches how Field tools highlight every applicable plot at once
        // while a tool is selected (see Field.tsx's "&.harvest-mode
        // .Plot.can-be-harvested" etc.), rather than only on hover: both
        // canBeHarvested and canBeChopped are already gated on the matching
        // tool being the active one (see their definitions above), so every
        // plot that tool applies to should read as such persistently, not
        // just the one currently under the cursor.
        '&.can-be-harvested': {
          backgroundColor: colorGreenOk,
          '&:hover': {
            cursor: 'pointer',
          },
        },
        '&.can-be-chopped': {
          backgroundColor: colorYellowCaution,
          '&:hover': {
            cursor: 'pointer',
          },
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
              onClick: handleTreeSpriteClick,
              style: {
                backgroundImage: treeImage ? `url(${treeImage})` : undefined,
              },
            }}
            sx={{
              backgroundPosition: 'bottom center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              bottom: '50%',
              cursor: 'pointer',
              imageRendering: 'pixelated',
              left: 0,
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
                  ...(isFruitRipe && { animated: true, heartBeat: true }),
                }),
                onClick: handleTreeSpriteClick,
                style: { backgroundImage: `url(${fruitImage})` },
              }}
              sx={{
                backgroundPosition: 'bottom center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                bottom: '50%',
                cursor: 'pointer',
                imageRendering: 'pixelated',
                left: 0,
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
            {isTree && (
              <Typography>
                {plotContent.daysOld}{' '}
                {plotContent.daysOld === 1 ? 'day' : 'days'} old
              </Typography>
            )}
            {isTree &&
              treeLifeStage &&
              fruitLifeStage &&
              (canBeChopped ? (
                <>
                  <Typography>{getChopActionText(isFruitRipe)}</Typography>
                  <Typography>
                    {getChopYieldText(
                      chopWoodRange,
                      isFruitRipe ? item?.name ?? null : null
                    )}
                  </Typography>
                </>
              ) : (
                <Typography>
                  {getTreeTooltipText(
                    treeLifeStage,
                    fruitLifeStage,
                    treeFertilizerType
                  )}
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
