import React from 'react';
import { func, number, object, string } from 'prop-types';
import Plot from '../Plot';
import classNames from 'classnames';

import './Field.css';

const Field = ({
  columns,
  handlePlotClick,
  rows,
  selectedPlantableItemId,
  state,
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
              <Plot key={j} {...{ handlePlotClick, state, x: j, y: i }} />
            ))}
        </div>
      ))}
  </div>
);

Field.propTypes = {
  columns: number.isRequired,
  handlePlotClick: func.isRequired,
  rows: number.isRequired,
  selectedPlantableItemId: string.isRequired,
  state: object.isRequired,
};

export default Field;
