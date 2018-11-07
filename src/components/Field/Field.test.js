/* eslint-disable import/first */
jest.mock('../../data/maps');
jest.mock('../../data/items');
jest.mock('../../img');

import React from 'react';
import Field, {
  getCropLifeStage,
  getLifestageRange,
  getLifeStageImageId,
  getPlotImage,
} from './Field';
import Plot from '../Plot';
import { shallow } from 'enzyme';

import { items as itemImages } from '../../img';

let component;

const getField = (props = {}) => (
  <Field
    {...{
      columns: 0,
      handlers: {
        handlePlotClick: () => {},
        ...props.handlers,
      },
      rows: 0,
      state: {
        field: [[null, null], [null, null], [null, null]],
        selectedPlantableItemId: '',
        ...props.state,
      },
      ...props.options,
    }}
  />
);

describe('field rendering', () => {
  beforeEach(() => {
    component = shallow(getField({ options: { columns: 2, rows: 3 } }));
  });

  it('renders rows', () => {
    expect(component.find('.row').length).toEqual(3);
  });

  it('renders columns', () => {
    expect(
      component
        .find('.row')
        .at(0)
        .find(Plot).length
    ).toEqual(2);
  });
});

describe('is-plantable-item-selected class', () => {
  it('is not present when item is not selected', () => {
    expect(component.hasClass('is-plantable-item-selected')).toBeFalsy();
  });

  it('is present when item is selected', () => {
    component = shallow(
      getField({ state: { selectedPlantableItemId: 'stub-item' } })
    );
    expect(component.hasClass('is-plantable-item-selected')).toBeTruthy();
  });
});

describe('getLifestageRange', () => {
  it('converts a cropTimetable to an array of stages', () => {
    expect(getLifestageRange({ germinate: 1, grow: 2, flower: 3 })).toEqual([
      'germinate',
      'grow',
      'grow',
      'flower',
      'flower',
      'flower',
    ]);
  });
});

describe('getCropLifeStage', () => {
  const cropTimetable = { germinate: 1, grow: 2, flower: 3 };

  it('gets corrent life stage for index', () => {
    expect(getCropLifeStage({ cropTimetable }, 2)).toBe('grow');
  });

  it('defaults to "dead"', () => {
    expect(getCropLifeStage({ cropTimetable }, 6)).toBe('dead');
  });
});

describe('getLifeStageImageId', () => {
  it('maps a life cycle label to an image name chunk', () => {
    const itemId = 'sample-crop-1';

    expect(getLifeStageImageId({ itemId, daysOld: 0 })).toBe('seeds');
    expect(getLifeStageImageId({ itemId, daysOld: 1 })).toBe('growing');
    expect(getLifeStageImageId({ itemId, daysOld: 3 })).toBe('grown');
    expect(getLifeStageImageId({ itemId, daysOld: 6 })).toBe('dead');
  });
});

describe('getPlotImage', () => {
  it('returns null when no crop is provided', () => {
    expect(getPlotImage(null)).toBe(null);
  });

  it('returns a plot images for a crop', () => {
    const itemId = 'sample-crop-1';

    expect(getPlotImage({ itemId, daysOld: 0 })).toBe(
      itemImages['sample-seeds']
    );
    expect(getPlotImage({ itemId, daysOld: 1 })).toBe(
      itemImages['sample-growing']
    );
    expect(getPlotImage({ itemId, daysOld: 3 })).toBe(
      itemImages['sample-grown']
    );
    expect(getPlotImage({ itemId, daysOld: 6 })).toBe(
      itemImages['sample-dead']
    );
  });
});
