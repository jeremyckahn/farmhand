import React from 'react';
import { array, number, object, shape, string } from 'prop-types';
import Plot from '../Plot';
import classNames from 'classnames';

import './Field.sass';

const Field = ({
  handlers,
  columns,
  rows,
  state,
  state: { field, selectedPlantableItemId },
}) => (
  <div
    className={classNames('Field', {
      'is-plantable-item-selected': selectedPlantableItemId,
    })}
  >
    {Array(rows)
      .fill(null)
      .map((_null, i) => (
        <div className="row" key={i}>
          {Array(columns)
            .fill(null)
            .map((_null, j) => (
              <Plot
                key={j}
                {...{ handlers, item: field[i][j], state, x: j, y: i }}
              />
            ))}
        </div>
      ))}
  </div>
);

Field.propTypes = {
  columns: number.isRequired,
  handlers: object.isRequired,
  rows: number.isRequired,
  state: shape({
    field: array.isRequired,
    selectedPlantableItemId: string.isRequired,
  }).isRequired,
};

export default Field;
