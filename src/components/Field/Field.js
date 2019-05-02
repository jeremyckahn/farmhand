import React from 'react';
import FarmhandContext from '../../Farmhand.context';
import { array, number, shape, string } from 'prop-types';
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

export const Field = ({
  columns,
  rows,
  state: { field, selectedItemId, fieldMode },
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
                  plotContent,
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
  rows: number.isRequired,
  state: shape({
    field: array.isRequired,
    selectedItemId: string.isRequired,
    fieldMode: string.isRequired,
  }).isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {context => <Field {...{ ...context, ...props }} />}
    </FarmhandContext.Consumer>
  );
}
