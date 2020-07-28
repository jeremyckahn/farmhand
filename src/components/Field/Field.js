import React, { memo, useEffect, useState } from 'react'
import { array, element, func, number, object, string } from 'prop-types'
import Fab from '@material-ui/core/Fab'
import Slider from '@material-ui/core/Slider'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import Tooltip from '@material-ui/core/Tooltip'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { GlobalHotKeys } from 'react-hotkeys'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import Plot from '../Plot'
import QuickSelect from '../QuickSelect'
import { FIELD_ZOOM_SCALE_DISABLE_SWIPE_THRESHOLD } from '../../constants'
import { fieldMode } from '../../enums'
import { doesInventorySpaceRemain, memoize } from '../../utils'

import './Field.sass'

const {
  CLEANUP,
  FERTILIZE,
  HARVEST,
  PLANT,
  SET_SCARECROW,
  SET_SPRINKLER,
  WATER,
} = fieldMode

const keyMap = {
  zoomIn: ['=', 'plus'],
  zoomOut: '-',
}

export const isInHoverRange = ({
  hoveredPlotRangeSize,
  hoveredPlot: { x: hoveredPlotX, y: hoveredPlotY },
  x,
  y,
}) => {
  // If hoveredPlotX is null, assume that hoveredPlotY is as well.
  if (hoveredPlotX == null) {
    return false
  }

  const squareSize = 2 * hoveredPlotRangeSize
  const rangeFloorX = hoveredPlotX - hoveredPlotRangeSize
  const rangeFloorY = hoveredPlotY - hoveredPlotRangeSize
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
  hoveredPlot: object.isRequired,
  hoveredPlotRangeSize: number.isRequired,
  plotContent: object,
  setHoveredPlot: func.isRequired,
  x: number.isRequired,
  y: number.isRequired,
}

export const FieldContentWrapper = ({
  fieldContent,

  zoomIn,
  zoomOut,
  currentScale,
  previousScale,
  resetTransform,
}) => {
  useEffect(() => {
    if (currentScale === 1 && previousScale !== 1) {
      resetTransform()
    }
  }, [currentScale, previousScale, resetTransform])

  return (
    <>
      <TransformComponent>{fieldContent}</TransformComponent>
      <GlobalHotKeys
        {...{
          keyMap,
          handlers: {
            zoomIn,
            zoomOut,
          },
        }}
      >
        <div className="fab-buttons zoom-controls right">
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
        <div className="fab-buttons zoom-controls left">
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
      </GlobalHotKeys>
    </>
  )
}

FieldContentWrapper.propTypes = {
  fieldContent: element.isRequired,
}

const mapArray = memoize(size => Array(size).fill(null))

export const FieldContent = ({
  columns,
  field,
  hoveredPlot,
  hoveredPlotRangeSize,
  rows,
  setHoveredPlot,
}) => (
  <>
    {mapArray(rows).map((_null, y) => (
      <div className="row" key={y}>
        {mapArray(columns).map((_null, x, arr, plotContent = field[y][x]) => (
          <MemoPlot
            key={x}
            {...{
              hoveredPlot,
              hoveredPlotRangeSize,
              plotContent,
              setHoveredPlot,
              x,
              y,
            }}
          />
        ))}
      </div>
    ))}
  </>
)

FieldContent.propTypes = {
  columns: number.isRequired,
  field: array.isRequired,
  hoveredPlot: object.isRequired,
  hoveredPlotRangeSize: number.isRequired,
  rows: number.isRequired,
  setHoveredPlot: func.isRequired,
}

const adjustableRangeFieldModes = new Set([
  CLEANUP,
  FERTILIZE,
  HARVEST,
  PLANT,
  WATER,
])

export const Field = props => {
  const {
    fieldMode,
    handleFieldActionRangeChange,
    handleFieldZoom,
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

  useEffect(() => {
    handleFieldZoom(currentScale)
  }, [currentScale, handleFieldZoom])

  const handleFieldActionRangeSliderChange = value => {
    setFieldActionRange(value)
    handleFieldActionRangeChange(value)
  }

  return (
    <div
      {...{
        className: classNames('Field', {
          'cleanup-mode': fieldMode === CLEANUP,
          'fertilize-mode': fieldMode === FERTILIZE,
          'harvest-mode': fieldMode === HARVEST,
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
            disabled: currentScale < FIELD_ZOOM_SCALE_DISABLE_SWIPE_THRESHOLD,
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
                <FieldContent {...{ ...props, hoveredPlot, setHoveredPlot }} />
              ),
            }}
          />
        )}
      </TransformWrapper>
      <div className="slider-wrapper">
        <Slider
          {...{
            disabled: !adjustableRangeFieldModes.has(fieldMode),
            marks: true,
            max: 3,
            min: 0,
            onChange: (e, value) => handleFieldActionRangeSliderChange(value),
            step: 1,
            value: fieldActionRange,
            valueLabelDisplay: 'auto',
            valueLabelFormat: value => `${value * 2 + 1}`,
          }}
        />
      </div>
      <QuickSelect />
      <div {...{ className: 'spacer' }} />
    </div>
  )
}

Field.propTypes = {
  columns: number.isRequired,
  field: array.isRequired,
  fieldMode: string.isRequired,
  handleFieldActionRangeChange: func.isRequired,
  handleFieldZoom: func.isRequired,
  hoveredPlotRangeSize: number.isRequired,
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
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
