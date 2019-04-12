import React from 'react';
import { array, arrayOf, number, object, shape, string } from 'prop-types';
import Plot from '../Plot';
import { fieldMode } from '../../enums';
import classNames from 'classnames';

import './Field.sass';

const {
  CLEANUP,
  FERTILIZE,
  HARVEST,
  PLANT,
  SET_SCARECROW,
  SET_SPRINKLER,
  WATER,
} = fieldMode;

const Field = ({
  handlers,
  columns,
  rows,
  state,
  state: { field, hoveredPlotRange, selectedItemId, fieldMode },
}) => (
  <div
    className={classNames('Field', {
      'cleanup-mode': fieldMode === CLEANUP,
      'fertilize-mode': fieldMode === FERTILIZE,
      'harvest-mode': fieldMode === HARVEST,
      'plant-mode': fieldMode === PLANT,
      'set-scarecrow-mode': fieldMode === SET_SCARECROW,
      'set-sprinkler-mode': fieldMode === SET_SPRINKLER,
      'water-mode': fieldMode === WATER,
    })}
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
                  handlers,
                  hoveredPlotRange,
                  plotContent,
                  state,
                  x: j,
                  y: i,
                }}
              />
            ))}
        </div>
      ))}
  </div>
);

Field.propTypes = {
  columns: number.isRequired,
  handlers: object.isRequired,
  hoveredPlotRange: arrayOf(array),
  rows: number.isRequired,
  state: shape({
    field: array.isRequired,
    selectedItemId: string.isRequired,
    fieldMode: string.isRequired,
  }).isRequired,
};

export default Field;
