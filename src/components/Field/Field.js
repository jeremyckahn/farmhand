import React from 'react';
import { number } from 'prop-types';
import './Field.css';

const Field = ({ columns, rows }) => (
  <div className="Field">
    {Array(rows)
      .fill(null)
      .map((_null, i) => (
        <div className="row" key={i}>
          {Array(columns)
            .fill(null)
            .map((_null, j) => (
              <div className="plot" key={j} />
            ))}
        </div>
      ))}
  </div>
);

Field.propTypes = {
  columns: number.isRequired,
  rows: number.isRequired,
};

export default Field;
