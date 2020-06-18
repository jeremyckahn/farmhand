import React, { useState } from 'react'
import { array, number, string } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import Plot from '../Plot'
import { fieldMode } from '../../enums'

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

export const Field = ({ columns, field, fieldMode, purchasedField, rows }) => {
  const [hoveredPlot, setHoveredPlot] = useState({ x: null, y: null })

  return (
    <div
      {...{
        className: classNames('Field', {
          'cleanup-mode': fieldMode === CLEANUP,
          'fertilize-mode': fieldMode === FERTILIZE,
          'harvest-mode': fieldMode === HARVEST,
          'plant-mode': fieldMode === PLANT,
          'set-scarecrow-mode': fieldMode === SET_SCARECROW,
          'set-sprinkler-mode': fieldMode === SET_SPRINKLER,
          'water-mode': fieldMode === WATER,
        }),
        'data-purchased-field': purchasedField,
      }}
    >
      {Array(rows)
        .fill(null)
        .map((_null, i) => (
          <div className="row" key={i}>
            {Array(columns)
              .fill(null)
              .map((_null, j, arr, plotContent = field[i][j]) => (
                <Plot
                  key={j}
                  {...{
                    hoveredPlot,
                    plotContent,
                    setHoveredPlot,
                    x: j,
                    y: i,
                  }}
                />
              ))}
          </div>
        ))}
    </div>
  )
}

Field.propTypes = {
  columns: number.isRequired,
  field: array.isRequired,
  fieldMode: string.isRequired,
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
