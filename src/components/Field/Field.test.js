import React from 'react';
import Field from './Field';
import Plot from '../Plot';
import { fieldMode } from '../../enums';
import { shallow } from 'enzyme';

jest.mock('../../data/maps');
jest.mock('../../data/items');
jest.mock('../../img');

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
        fieldMode: fieldMode.OBSERVE,
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
    expect(component.find('.row')).toHaveLength(3);
  });

  it('renders columns', () => {
    expect(
      component
        .find('.row')
        .at(0)
        .find(Plot)
    ).toHaveLength(2);
  });
});

describe('plantable-item-selected class', () => {
  it('is not present when fieldMode != PLANT', () => {
    expect(component.hasClass('plantable-item-selected')).toBeFalsy();
  });

  it('is present when fieldMode == PLANT', () => {
    component = shallow(getField({ state: { fieldMode: fieldMode.PLANT } }));

    expect(component.hasClass('plantable-item-selected')).toBeTruthy();
  });
});

describe('hoe-selected class', () => {
  it('is not present when fieldMode != HARVEST', () => {
    expect(component.hasClass('hoe-selected')).toBeFalsy();
  });

  it('is present when fieldMode == HARVEST', () => {
    component = shallow(getField({ state: { fieldMode: fieldMode.HARVEST } }));

    expect(component.hasClass('hoe-selected')).toBeTruthy();
  });
});

describe('scythe-selected class', () => {
  it('is not present when fieldMode != CLEANUP', () => {
    expect(component.hasClass('scythe-selected')).toBeFalsy();
  });

  it('is present when fieldMode == CLEANUP', () => {
    component = shallow(getField({ state: { fieldMode: fieldMode.CLEANUP } }));

    expect(component.hasClass('scythe-selected')).toBeTruthy();
  });
});

describe('watering-can-selected class', () => {
  it('is not present when fieldMode != WATER', () => {
    expect(component.hasClass('watering-can-selected')).toBeFalsy();
  });

  it('is present when fieldMode == WATER', () => {
    component = shallow(getField({ state: { fieldMode: fieldMode.WATER } }));

    expect(component.hasClass('watering-can-selected')).toBeTruthy();
  });
});
