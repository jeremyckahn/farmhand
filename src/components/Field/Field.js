import React from 'react';
import { array, number, object, shape, string } from 'prop-types';
import Plot from '../Plot';
import { getCropLifeStage, getPlotImage } from '../../utils';
import { fieldMode } from '../../enums';
import classNames from 'classnames';

import './Field.sass';

const { CLEANUP, FERTILIZE, HARVEST, PLANT, WATER } = fieldMode;

const Field = ({
  handlers,
  columns,
  rows,
  state,
  state: { field, selectedPlantableItemId, fieldMode },
}) => (
  <div
    className={classNames('Field', {
      'cleanup-mode': fieldMode === CLEANUP,
      'fertilize-mode': fieldMode === FERTILIZE,
      'harvest-mode': fieldMode === HARVEST,
      'plant-mode': fieldMode === PLANT,
      'water-mode': fieldMode === WATER,
    })}
  >
    {Array(rows)
      .fill(null)
      .map((_null, i) => (
        <div className="row" key={i}>
          {Array(columns)
            .fill(null)
            .map((_null, j, arr, crop = field[i][j]) => (
              <Plot
                key={j}
                {...{
                  handlers,
                  image: getPlotImage(crop),
                  lifeStage: crop && getCropLifeStage(crop),
                  crop,
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
  rows: number.isRequired,
  state: shape({
    field: array.isRequired,
    selectedPlantableItemId: string.isRequired,
    fieldMode: string.isRequired,
  }).isRequired,
};

export default Field;
