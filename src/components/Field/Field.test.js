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
import { toolType } from '../../enums';
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
        selectedTool: toolType.NONE,
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

describe('is-watering-can-selected class', () => {
  it('is not present when watering can is not selected', () => {
    expect(component.hasClass('is-watering-can-selected')).toBeFalsy();
  });

  it('is present when watering can is selected', () => {
    component = shallow(
      getField({ state: { selectedTool: toolType.WATERING_CAN } })
    );

    expect(component.hasClass('is-watering-can-selected')).toBeTruthy();
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

  it('defaults to "flower"', () => {
    expect(getCropLifeStage({ cropTimetable }, 6)).toBe('flower');
  });
});

describe('getLifeStageImageId', () => {
  it('maps a life cycle label to an image name chunk', () => {
    const itemId = 'sample-crop-1';

    expect(getLifeStageImageId({ itemId, daysWatered: 0 })).toBe('seeds');
    expect(getLifeStageImageId({ itemId, daysWatered: 1 })).toBe('growing');
    expect(getLifeStageImageId({ itemId, daysWatered: 3 })).toBe('grown');
  });
});

describe('getPlotImage', () => {
  it('returns null when no crop is provided', () => {
    expect(getPlotImage(null)).toBe(null);
  });

  it('returns a plot images for a crop', () => {
    const itemId = 'sample-crop-1';

    expect(getPlotImage({ itemId, daysWatered: 0 })).toBe(
      itemImages['sample-seeds']
    );
    expect(getPlotImage({ itemId, daysWatered: 1 })).toBe(
      itemImages['sample-growing']
    );
    expect(getPlotImage({ itemId, daysWatered: 3 })).toBe(
      itemImages['sample-grown']
    );
  });
});
