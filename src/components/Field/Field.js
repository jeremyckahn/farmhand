import React from 'react';
import { array, number, object, shape, string } from 'prop-types';
import Plot from '../Plot';
import { items as itemImages } from '../../img';
import { itemsMap } from '../../data/maps';
import { getCropId } from '../../utils';
import memoize from 'fast-memoize';
import classNames from 'classnames';

import './Field.sass';

export const getLifestageRange = memoize(cropTimetable =>
  ['germinate', 'grow', 'flower'].reduce(
    (acc, stage) => acc.concat(Array(cropTimetable[stage]).fill(stage)),
    []
  )
);

export const getCropLifeStage = (item, daysOld) =>
  getLifestageRange(item.cropTimetable)[daysOld] || 'dead';

const stageToImageNameMap = {
  germinate: 'seeds',
  grow: 'growing',
  flower: 'grown',
  dead: 'dead',
};

export const getLifeStageImageId = ({ itemId, daysOld }) =>
  stageToImageNameMap[getCropLifeStage(itemsMap[itemId], daysOld)];

export const getPlotImage = crop =>
  crop ? itemImages[`${getCropId(crop)}-${getLifeStageImageId(crop)}`] : null;

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
            .map((_null, j, arr, crop = field[i][j]) => (
              <Plot
                key={j}
                {...{
                  handlers,
                  image: getPlotImage(crop),
                  item: crop,
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
  }).isRequired,
};

export default Field;
