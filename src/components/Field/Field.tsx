import ZoomInIcon from '@mui/icons-material/ZoomIn.js'
import ZoomOutIcon from '@mui/icons-material/ZoomOut.js'
import Fab from '@mui/material/Fab/index.js'
import FormControl from '@mui/material/FormControl/index.js'
import FormControlLabel from '@mui/material/FormControlLabel/index.js'
import FormGroup from '@mui/material/FormGroup/index.js'
import Slider from '@mui/material/Slider/index.js'
import { Theme } from '@mui/material/styles/index.js'
import Switch from '@mui/material/Switch/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'
import { array, bool, element, func, number, object, string } from 'prop-types'
import React, { memo, useEffect, useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import tools from '../../data/tools.js'
import { fieldMode } from '../../enums.js'
import scarecrowImg from '../../img/items/scarecrow.png'
import sprinklerImg from '../../img/items/sprinkler.png'
import dirtBg from '../../img/ui/dirt.png'
import { breakpoints, layout } from '../../styles/tokens.js'
import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements.js'
import { levelAchieved } from '../../utils/levelAchieved.js'
import { nullArray } from '../../utils/nullArray.js'
import { Div } from '../Elements/index.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Plot from '../Plot/index.js'
import QuickSelect from '../QuickSelect/index.js'

const colorRedDanger = 'rgba(255, 0, 0, 0.5)'
const colorBlueWater = 'rgba(125, 245, 255, 0.6)'
const colorBrownFertilize = 'rgba(125, 56, 0, 0.75)'
const colorGreenOk = 'rgba(0, 255, 0, 0.5)'
const colorYellow = 'rgba(255, 255, 0, 0.75)'

// $appBarOffset (135px) + $horizontalQuickSelectOffest (80px)
const obscuringPortraitUiVerticalOffset = 215
// $appBarOffset (135px) + $bottomControlsOffset (260px)
const obscuringLandscapeUiVerticalOffset = 395

const {
  CLEANUP,
  FERTILIZE,
  HARVEST,
  MINE,
  OBSERVE,
  PLANT,
  SET_SCARECROW,
  SET_SPRINKLER,
  WATER,
} = fieldMode

const zoomKeyMap = {
  zoomIn: ['=', 'plus'],
  zoomOut: '-',
}

const fieldKeyMap: Record<string, string> = {
  selectWateringCan: tools.wateringCan.fieldKey,
  selectScythe: tools.scythe.fieldKey,
  selectHoe: tools.hoe.fieldKey,
}

if (tools.shovel) {
  fieldKeyMap.selectShovel = tools.shovel.fieldKey
}

export interface FieldProps {
  columns?: number
  experience: number
  field: Array<Array<farmhand.plotContent | null>>
  fieldMode: farmhand.fieldMode
  handleCombineEnabledChange: (e: any, checked: boolean) => void
  handleFieldActionRangeChange: (range: number) => void
  hoveredPlotRangeSize: number
  inventory: farmhand.state['inventory']
  inventoryLimit: farmhand.state['inventoryLimit']
  isCombineEnabled: boolean
  isMenuOpen?: boolean
  purchasedCombine: number
  purchasedField: number
  rows?: number
}

export interface FieldContentProps extends FieldProps {
  hoveredPlot: { x: number | null; y: number | null }
  setHoveredPlot: (coords: { x: number | null; y: number | null }) => void
}

export interface MemoPlotProps {
  experience: number
  fieldMode: farmhand.fieldMode
  hoveredPlot: { x: number | null; y: number | null }
  hoveredPlotRangeSize: number
  plotContent?: farmhand.plotContent | null
  setHoveredPlot?: (plot: { x: number | null; y: number | null }) => void
  x: number
  y: number
}

export const isInHoverRange = ({
  experience,
  fieldMode: propsFieldMode,
  hoveredPlotRangeSize,
  hoveredPlot: { x: hoveredPlotX, y: hoveredPlotY },
  x,
  y,
}: MemoPlotProps) => {
  // If hoveredPlotX is null, assume that hoveredPlotY is as well.
  // If fieldMode === OBSERVE, nothing is in hover range.
  if (
    hoveredPlotX == null ||
    hoveredPlotY == null ||
    propsFieldMode === OBSERVE
  ) {
    return false
  }

  let hoveredPlotRangeSizeToRender = hoveredPlotRangeSize

  switch (propsFieldMode) {
    case SET_SPRINKLER:
      hoveredPlotRangeSizeToRender = getLevelEntitlements(
        levelAchieved(experience)
      ).sprinklerRange

      break

    case SET_SCARECROW:
      hoveredPlotRangeSizeToRender = Number.MAX_SAFE_INTEGER

      break

    default:
  }

  const squareSize = 2 * hoveredPlotRangeSizeToRender
  const rangeFloorX = hoveredPlotX - hoveredPlotRangeSizeToRender
  const rangeFloorY = hoveredPlotY - hoveredPlotRangeSizeToRender
  const rangeCeilingX = rangeFloorX + squareSize
  const rangeCeilingY = rangeFloorY + squareSize

  return (
    x >= rangeFloorX &&
    x <= rangeCeilingX &&
    y >= rangeFloorY &&
    y <= rangeCeilingY
  )
}

export const MemoPlot = memo(
  (props: MemoPlotProps) => {
    const { hoveredPlot, plotContent, setHoveredPlot, x, y } = props

    return (
      <Plot
        {...{
          hoveredPlot,
          isInHoverRange: isInHoverRange(props),
          plotContent,
          setHoveredPlot,
          x,
          y,
        }}
      />
    )
  },
  (prev: MemoPlotProps, next: MemoPlotProps) => {
    if (isInHoverRange(prev) !== isInHoverRange(next)) {
      return false
    }

    return (
      prev.plotContent === next.plotContent &&
      prev.hoveredPlotRangeSize === next.hoveredPlotRangeSize
    )
  }
)

export const FieldContentWrapper = ({
  fieldContent,

  previousScale,
  resetTransform,
  scale,
  zoomIn,
  zoomOut,
}: {
  fieldContent: React.ReactNode
  previousScale: number
  resetTransform: () => void
  scale: number
  zoomIn: () => void
  zoomOut: () => void
}) => {
  useEffect(() => {
    if (scale === 1 && previousScale !== 1) {
      resetTransform()
    }
  }, [scale, previousScale, resetTransform])

  return (
    <>
      <GlobalHotKeys
        {...{
          keyMap: zoomKeyMap,
          handlers: {
            zoomIn,
            zoomOut,
          },
        }}
      />
      <TransformComponent>{fieldContent}</TransformComponent>
      <div className="fab-buttons zoom-controls zoom-in-wrapper">
        <Tooltip
          {...{
            placement: 'top',
            title: 'Zoom In',
          }}
        >
          <Fab
            {...{
              'aria-label': 'Zoom In',
              color: 'primary',
              onClick: zoomIn,
            }}
          >
            <ZoomInIcon />
          </Fab>
        </Tooltip>
      </div>
      <div className="fab-buttons zoom-controls zoom-out-wrapper">
        <Tooltip
          {...{
            placement: 'top',
            title: 'Zoom Out',
          }}
        >
          <Fab
            {...{
              'aria-label': 'Zoom Out',
              color: 'primary',
              onClick: zoomOut,
            }}
          >
            <ZoomOutIcon />
          </Fab>
        </Tooltip>
      </div>
    </>
  )
}

FieldContentWrapper.propTypes = {
  fieldContent: element.isRequired,
}

export const FieldContent = ({
  columns = 0,
  experience,
  field,
  fieldMode: propsFieldMode,
  handleCombineEnabledChange,
  hoveredPlot,
  hoveredPlotRangeSize,
  isCombineEnabled,
  purchasedCombine,
  rows = 0,
  setHoveredPlot,
}: FieldContentProps) => (
  <>
    <div
      {...{
        className: 'row-wrapper',
        onMouseLeave: () => setHoveredPlot({ x: null, y: null }),
      }}
    >
      {nullArray(rows).map((_rowIndex: null, y: number) => (
        <div className="row" key={y}>
          {nullArray(columns).map((_colIndex: null, x: number) => {
            const plotContent = field[y][x]

            return (
              <MemoPlot
                key={x}
                {...{
                  experience,
                  fieldMode: propsFieldMode,
                  hoveredPlot,
                  hoveredPlotRangeSize,
                  plotContent,
                  setHoveredPlot,
                  x,
                  y,
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
    {purchasedCombine ? (
      <FormControl variant="standard" component="fieldset">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={isCombineEnabled}
                onChange={handleCombineEnabledChange}
                name="is-combine-enabled"
              />
            }
            label="Automatically harvest crops at the start of every day"
          />
        </FormGroup>
      </FormControl>
    ) : null}
  </>
)

FieldContent.propTypes = {
  columns: number.isRequired,
  experience: number.isRequired,
  field: array.isRequired,
  fieldMode: string.isRequired,
  handleCombineEnabledChange: func.isRequired,
  hoveredPlot: object.isRequired,
  hoveredPlotRangeSize: number.isRequired,
  isCombineEnabled: bool.isRequired,
  purchasedCombine: number.isRequired,
  rows: number.isRequired,
  setHoveredPlot: func.isRequired,
}

const adjustableRangeFieldModes = new Set<string>([
  CLEANUP,
  FERTILIZE,
  HARVEST,
  MINE,
  PLANT,
  WATER,
])

const RangeSliderValueLabelComponent = ({
  children,
  open,
  value,
}: {
  children: React.ReactElement
  open: boolean
  value: number
}) => (
  <Tooltip
    {...{
      open,
      placement: 'top',
      title: (
        <Typography>
          Range: {value} x {value}
        </Typography>
      ),
    }}
  >
    {children}
  </Tooltip>
)

export const Field = (props: FieldProps) => {
  const {
    field,
    fieldMode: propsFieldMode,
    handleFieldActionRangeChange,
    hoveredPlotRangeSize,
    inventory,
    inventoryLimit,
    isMenuOpen = true,
    purchasedField,
  } = props

  const [hoveredPlot, setHoveredPlot] = useState<{
    x: number | null
    y: number | null
  }>({ x: null, y: null })
  const [currentScale, setCurrentScale] = useState(1)
  const [fieldActionRange, setFieldActionRange] = useState(hoveredPlotRangeSize)

  useEffect(() => {
    setFieldActionRange(hoveredPlotRangeSize)
  }, [hoveredPlotRangeSize])

  const handleFieldActionRangeSliderChange = (value: number) => {
    setFieldActionRange(value)
    handleFieldActionRangeChange(value)
  }

  return (
    <>
      <GlobalHotKeys
        {...{
          keyMap: fieldKeyMap,
          // Handlers are defined in Farmhand.js's initInputHandlers.
        }}
      />
      <Div
        {...{
          className: classNames('Field', {
            'cleanup-mode': propsFieldMode === CLEANUP,
            'fertilize-mode': propsFieldMode === FERTILIZE,
            'harvest-mode': propsFieldMode === HARVEST,
            'mine-mode': propsFieldMode === MINE,
            'is-inventory-full': !doesInventorySpaceRemain({
              inventory,
              inventoryLimit,
            }),
            'plant-mode': propsFieldMode === PLANT,
            'set-scarecrow-mode': propsFieldMode === SET_SCARECROW,
            'set-sprinkler-mode': propsFieldMode === SET_SPRINKLER,
            'water-mode': propsFieldMode === WATER,
          }),
          'data-purchased-field': purchasedField,
          'data-testid': 'field',
        }}
        sx={(theme: Theme) => ({
          margin: '0 auto',
          '@media (orientation: portrait)': {
            marginBottom: '10.5em',
            [`@media (min-width: ${breakpoints.sm}px)`]: {
              '&[data-purchased-field="0"]': {
                maxWidth: `calc(100vh * (6/10) - ${obscuringPortraitUiVerticalOffset}px)`,
              },
              '&[data-purchased-field="1"]': {
                maxWidth: `calc(100vh * (8/12) - ${obscuringPortraitUiVerticalOffset}px)`,
              },
              '&[data-purchased-field="2"]': {
                maxWidth: `calc(100vh * (10/16) - ${obscuringPortraitUiVerticalOffset}px)`,
              },
              '&[data-purchased-field="3"]': {
                maxWidth: `calc(100vh * (12/18) - ${obscuringPortraitUiVerticalOffset}px)`,
              },
            },
          },
          '@media (orientation: landscape)': {
            margin: '5em auto',
            [`@media (min-height: ${breakpoints.largePhone}px)`]: {
              marginTop: 'auto',
            },
            [`@media (min-height: ${breakpoints.sm}px)`]: {
              '&[data-purchased-field="0"]': {
                maxWidth: `calc(100vh * (10/6) - ${obscuringLandscapeUiVerticalOffset}px)`,
              },
              '&[data-purchased-field="1"]': {
                maxWidth: `calc(100vh * (12/8) - ${obscuringLandscapeUiVerticalOffset}px)`,
              },
              '&[data-purchased-field="2"]': {
                maxWidth: `calc(100vh * (16/10) - ${obscuringLandscapeUiVerticalOffset}px)`,
              },
              '&[data-purchased-field="3"]': {
                maxWidth: `calc(100vh * (18/12) - ${obscuringLandscapeUiVerticalOffset}px)`,
              },
            },
          },
          '& .row': {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            '@media (orientation: landscape)': {
              flexDirection: 'column-reverse',
            },
          },
          '& .react-transform-component': {
            overflow: 'visible',
            width: 'auto',
          },
          '& .react-transform-element': {
            display: 'block',
            height: 'auto',
            width: 'auto',
            '& .row-wrapper': {
              backgroundImage: `url(${dirtBg})`,
              border: 'solid 1px #000',
              backgroundRepeat: 'repeat',
              backgroundSize: 'calc(100% * (1 / 6) * 1.5)',
              imageRendering: 'pixelated',
              display: 'flex',
              flexDirection: 'column',
              '@media (orientation: landscape)': {
                flexDirection: 'row',
                marginRight: layout.fieldSpaceForRightSideControls,
              },
            },
          },
          '&[data-purchased-field="1"] .react-transform-element': {
            backgroundSize: 'calc(100% * (1 / 8) * 1.5)',
          },
          '&[data-purchased-field="2"] .react-transform-element': {
            backgroundSize: 'calc(100% * (1 / 10) * 1.5)',
          },
          '&[data-purchased-field="3"] .react-transform-element': {
            backgroundSize: 'calc(100% * (1 / 12) * 1.5)',
          },
          '& .slider-wrapper': {
            alignItems: 'center',
            background: 'rgba(128, 128, 128, 0.5)',
            borderRadius: '2em',
            bottom: '7.5em',
            display: 'flex',
            left: isMenuOpen
              ? `calc(50vw + ${layout.sidebarWidth} / 2)`
              : '50%',
            padding: '0 1em',
            position: 'fixed',
            transform: 'translateX(-50%)',
            transition: theme.transitions.create('left', {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeOut,
            }),
            width: '250px',
            '@media (orientation: portrait)': {
              bottom: '13.5em',
              display: isMenuOpen ? 'none' : undefined,
            },
          },
          '& .zoom-controls': {
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            bottom: '1em',
            '@media (orientation: portrait)': {
              display: isMenuOpen ? 'none' : undefined,
            },
            '&.zoom-in-wrapper': {
              right: '0.5em',
              '@media (orientation: portrait)': { right: '0.25em' },
              '@media (orientation: landscape)': { bottom: '5.5em' },
            },
            '&.zoom-out-wrapper': {
              '@media (orientation: portrait)': { left: '0.5em' },
              '@media (orientation: landscape)': { right: '0.5em' },
            },
            [`@media (max-width: ${breakpoints.mediumPhone}px)`]: {
              bottom: '0.25em',
            },
            '& button': { margin: '0.5em' },
          },
          '& .MuiFormControl-root': {
            alignItems: 'center',
            display: 'flex',
            padding: '1em 0 0',
          },
          '&.water-mode .Plot.crop:hover': {
            backgroundColor: colorBlueWater,
            cursor: 'pointer',
          },
          '&.water-mode .Plot.is-in-hover-range': {
            backgroundColor: colorBlueWater,
          },
          '&.fertilize-mode .Plot.can-be-fertilized': {
            backgroundColor: colorBrownFertilize,
            '&:hover': { cursor: 'pointer' },
          },
          '&.harvest-mode .Plot.can-be-harvested': {
            backgroundColor: colorGreenOk,
            '&:hover': { cursor: 'pointer' },
          },
          '&.mine-mode .Plot.can-be-mined': {
            backgroundColor: colorGreenOk,
            '&:hover': { cursor: 'pointer', borderColor: colorYellow },
            '&.is-in-hover-range': { borderColor: colorYellow },
          },
          '&.cleanup-mode .Plot.crop': {
            backgroundColor: colorYellow,
            cursor: 'pointer',
          },
          '&.harvest-mode.is-inventory-full .Plot.crop.can-be-harvested, &.cleanup-mode.is-inventory-full .Plot.is-replantable': {
            backgroundColor: colorRedDanger,
            cursor: 'not-allowed',
          },
          '&.cleanup-mode .Plot.is-replantable': {
            backgroundColor: colorGreenOk,
            cursor: 'pointer',
          },
          '&.cleanup-mode .Plot.can-be-harvested': {
            backgroundColor: colorGreenOk,
            cursor: 'auto',
          },
          '&.set-sprinkler-mode:hover .Plot:hover, &.set-scarecrow-mode:hover .Plot:hover': {
            '&.is-empty img': { cursor: 'pointer', opacity: 0.5 },
            '&:not(.is-empty)': {
              backgroundColor: colorRedDanger,
              backgroundImage: 'none',
              cursor: 'not-allowed',
            },
          },
          '&.set-sprinkler-mode:hover .Plot:hover.is-empty img': {
            backgroundImage: `url(${sprinklerImg})`,
          },
          '&.set-scarecrow-mode:hover .Plot:hover.is-empty img': {
            backgroundImage: `url(${scarecrowImg})`,
          },
        })}
      >
        <TransformWrapper
          {...{
            options: {
              limitToBounds: false,
            },
            reset: {
              animationTime: 0,
            },
            pan: {
              disabled: currentScale <= 1,
            },
            // These 0s prevent NREs within react-zoom-pan-pinch, but also
            // disable zoom animations.
            zoomIn: {
              animationTime: 0,
            },
            zoomOut: {
              animationTime: 0,
            },
            onZoomChange: ({ scale }: { scale: number }) => {
              // If setCurrentScale with scale < 1 is called here, it causes a
              // reference error within react-zoom-pan-pinch.
              if (scale >= 1) {
                setCurrentScale(scale)
              }
            },
            wheel: {
              disabled: true,
            },
            doubleClick: { disabled: true },
          }}
        >
          {(transformProps: any) => (
            <FieldContentWrapper
              {...{
                ...transformProps,
                fieldContent: (
                  <FieldContent
                    {...{ ...props, hoveredPlot, setHoveredPlot }}
                  />
                ),
              }}
            />
          )}
        </TransformWrapper>
        {adjustableRangeFieldModes.has(propsFieldMode) && (
          <div className="slider-wrapper">
            <Slider
              {...{
                marks: true,
                max: field.length - 1,
                min: 0,
                onChange: (e: any, value: any) =>
                  handleFieldActionRangeSliderChange(value),
                step: 1,
                value: fieldActionRange,
                valueLabelDisplay: 'auto',
                valueLabelFormat: (value: number) => `${value * 2 + 1}`,
                components: {
                  ValueLabel: RangeSliderValueLabelComponent,
                },
              }}
            />
          </div>
        )}
        <QuickSelect />
      </Div>
    </>
  )
}

Field.propTypes = {
  columns: number.isRequired,
  experience: number.isRequired,
  field: array.isRequired,
  fieldMode: string.isRequired,
  handleCombineEnabledChange: func.isRequired,
  handleFieldActionRangeChange: func.isRequired,
  hoveredPlotRangeSize: number.isRequired,
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
  isCombineEnabled: bool.isRequired,
  isMenuOpen: bool,
  purchasedCombine: number.isRequired,
  purchasedField: number.isRequired,
  rows: number.isRequired,
}

export default function Consumer(props: Partial<FieldProps>) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Field {...({ ...gameState, ...handlers, ...props } as FieldProps)} />
      )}
    </FarmhandContext.Consumer>
  )
}
