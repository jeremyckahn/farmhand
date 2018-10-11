import React from 'react';
import { func, number } from 'prop-types';
import Plot from '../Plot';
import './Field.css';

const Field = ({ columns, handlePlotClick, rows }) => (
  <div className="Field">
    {Array(rows)
      .fill(null)
      .map((_null, i) => (
        <div className="row" key={i}>
          {Array(columns)
            .fill(null)
            .map((_null, j) => (
              <Plot key={j} {...{ handlePlotClick, x: j, y: i }} />
            ))}
        </div>
      ))}
  </div>
);

Field.propTypes = {
  columns: number.isRequired,
  handlePlotClick: func.isRequired,
  rows: number.isRequired,
};

export default Field;
