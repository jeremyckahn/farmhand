import React, { memo, useEffect, useState } from 'react'
import { array, bool, element, func, number, object, string } from 'prop-types'
import Fab from '@mui/material/Fab'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { GlobalHotKeys } from 'react-hotkeys'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context'
import Plot from '../Plot'
import QuickSelect from '../QuickSelect'
import { fieldMode } from '../../enums'
import tools from '../../data/tools'
import { levelAchieved } from '../../utils/levelAchieved'
import { doesInventorySpaceRemain, nullArray } from '../../utils'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements'

import './Field.sass'

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

const fieldKeyMap = {
  selectWateringCan: tools.wateringCan.fieldKey,
  selectScythe: tools.scythe.fieldKey,
  selectHoe: tools.hoe.fieldKey,
}

if (tools.shovel) {
  fieldKeyMap.selectShovel = tools.shovel.fieldKey
}

export const isInHoverRange = ({
  experience,
  fieldMode,
  hoveredPlotRangeSize,
  hoveredPlot: { x: hoveredPlotX, y: hoveredPlotY },
  x,
  y,
}) => {
  // If hoveredPlotX is null, assume that hoveredPlotY is as well.
  // If fieldMode === OBSERVE, nothing is in hover range.
  if (hoveredPlotX == null || fieldMode === OBSERVE) {
    return false
  }

  let hoveredPlotRangeSizeToRender = hoveredPlotRangeSize

  switch (fieldMode) {
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
  props => {
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
  (prev, next) => {
    if (isInHoverRange(prev) !== isInHoverRange(next)) {
      return false
    }

    return (
      prev.plotContent === next.plotContent &&
      prev.hoveredPlotRangeSize === next.hoveredPlotRangeSize
    )
  }
)

MemoPlot.propTypes = {
  experience: number.isRequired,
  fieldMode: string.isRequired,
  hoveredPlot: object.isRequired,
  hoveredPlotRangeSize: number.isRequired,
  plotContent: object,
  setHoveredPlot: func.isRequired,
  x: number.isRequired,
  y: number.isRequired,
}

export const FieldContentWrapper = ({
  fieldContent,

  previousScale,
  resetTransform,
  scale,
  zoomIn,
  zoomOut,
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
  columns,
  experience,
  field,
  fieldMode,
  handleCombineEnabledChange,
  hoveredPlot,
  hoveredPlotRangeSize,
  isCombineEnabled,
  purchasedCombine,
  rows,
  setHoveredPlot,
}) => (
  <>
    <div
      {...{
        className: 'row-wrapper',
        onMouseLeave: () => setHoveredPlot({ x: null, y: null }),
      }}
    >
      {nullArray(rows).map((_null, y) => (
        <div className="row" key={y}>
          {nullArray(columns).map(
            (_null, x, arr, plotContent = field[y][x]) => (
              <MemoPlot
                key={x}
                {...{
                  experience,
                  fieldMode,
                  hoveredPlot,
                  hoveredPlotRangeSize,
                  plotContent,
                  setHoveredPlot,
                  x,
                  y,
                }}
              />
            )
          )}
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

const adjustableRangeFieldModes = new Set([
  CLEANUP,
  FERTILIZE,
  HARVEST,
  MINE,
  PLANT,
  WATER,
])

const RangeSliderValueLabelComponent = ({ children, open, value }) => (
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

export const Field = props => {
  const {
    field,
    fieldMode,
    handleFieldActionRangeChange,
    hoveredPlotRangeSize,
    inventory,
    inventoryLimit,
    purchasedField,
  } = props

  const [hoveredPlot, setHoveredPlot] = useState({ x: null, y: null })
  const [currentScale, setCurrentScale] = useState(1)
  const [fieldActionRange, setFieldActionRange] = useState(hoveredPlotRangeSize)

  useEffect(() => {
    setFieldActionRange(hoveredPlotRangeSize)
  }, [hoveredPlotRangeSize])

  const handleFieldActionRangeSliderChange = value => {
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
      <div
        {...{
          className: classNames('Field', {
            'cleanup-mode': fieldMode === CLEANUP,
            'fertilize-mode': fieldMode === FERTILIZE,
            'harvest-mode': fieldMode === HARVEST,
            'mine-mode': fieldMode === MINE,
            'is-inventory-full': !doesInventorySpaceRemain({
              inventory,
              inventoryLimit,
            }),
            'plant-mode': fieldMode === PLANT,
            'set-scarecrow-mode': fieldMode === SET_SCARECROW,
            'set-sprinkler-mode': fieldMode === SET_SPRINKLER,
            'water-mode': fieldMode === WATER,
          }),
          'data-purchased-field': purchasedField,
        }}
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
            onZoomChange: ({ scale }) => {
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
          {transformProps => (
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
        {adjustableRangeFieldModes.has(fieldMode) && (
          <div className="slider-wrapper">
            <Slider
              {...{
                marks: true,
                max: field.length - 1,
                min: 0,
                onChange: (e, value) =>
                  handleFieldActionRangeSliderChange(value),
                step: 1,
                value: fieldActionRange,
                valueLabelDisplay: 'auto',
                valueLabelFormat: value => `${value * 2 + 1}`,
                components: {
                  ValueLabel: RangeSliderValueLabelComponent,
                },
              }}
            />
          </div>
        )}
        <QuickSelect />
      </div>
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
  purchasedCombine: number.isRequired,
  purchasedField: number.isRequired,
  rows: number.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Field {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
