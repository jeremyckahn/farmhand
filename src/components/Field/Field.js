import React from 'react';
import { array, number, object, shape, string } from 'prop-types';
import Plot from '../Plot';
import { getCropLifeStage, getPlotImage } from '../../utils';
import { toolType } from '../../enums';
import classNames from 'classnames';

import './Field.sass';

const { HOE, SCYTHE, WATERING_CAN } = toolType;

// TODO: Pass lifeStage as null if crop is null
const Field = ({
  handlers,
  columns,
  rows,
  state,
  state: { field, selectedPlantableItemId, selectedTool },
}) => (
  <div
    className={classNames('Field', {
      'plantable-item-selected': selectedPlantableItemId,
      'hoe-selected': selectedTool === HOE,
      'scythe-selected': selectedTool === SCYTHE,
      'watering-can-selected': selectedTool === WATERING_CAN,
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
                  lifeStage: crop ? getCropLifeStage(crop) : '',
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
    selectedTool: string.isRequired,
  }).isRequired,
};

export default Field;
