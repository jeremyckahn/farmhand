import React from 'react';
import { number } from 'prop-types';
import './Field.css';

const Field = ({ columns, rows }) => (
  <div className="Field">
    <table>
      <tbody>
        {Array(rows)
          .fill(null)
          .map((_null, i) => (
            <tr key={i}>
              {Array(columns)
                .fill(null)
                .map((_null, j) => (
                  <td key={j} />
                ))}
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

Field.propTypes = {
  columns: number.isRequired,
  rows: number.isRequired,
};

export default Field;
