/* eslint-disable import/first */
jest.mock('../../data/maps');
jest.mock('../../data/items');
jest.mock('../../img');

import React from 'react';
import Field from './Field';
import Plot from '../Plot';
import { toolType } from '../../enums';
import { shallow } from 'enzyme';

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

describe('watering-can-selected class', () => {
  it('is not present when watering can is not selected', () => {
    expect(component.hasClass('watering-can-selected')).toBeFalsy();
  });

  it('is present when watering can is selected', () => {
    component = shallow(
      getField({ state: { selectedTool: toolType.WATERING_CAN } })
    );

    expect(component.hasClass('watering-can-selected')).toBeTruthy();
  });
});
