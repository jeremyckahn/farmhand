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

describe('fertilize-mode class', () => {
  it('is not present when fieldMode != FERTILIZE', () => {
    expect(component.hasClass('fertilize-mode')).toBeFalsy();
  });

  it('is present when fieldMode == FERTILIZE', () => {
    component = shallow(
      getField({ state: { fieldMode: fieldMode.FERTILIZE } })
    );

    expect(component.hasClass('fertilize-mode')).toBeTruthy();
  });
});

describe('plant-mode class', () => {
  it('is not present when fieldMode != PLANT', () => {
    expect(component.hasClass('plant-mode')).toBeFalsy();
  });

  it('is present when fieldMode == PLANT', () => {
    component = shallow(getField({ state: { fieldMode: fieldMode.PLANT } }));

    expect(component.hasClass('plant-mode')).toBeTruthy();
  });
});

describe('harvest-mode class', () => {
  it('is not present when fieldMode != HARVEST', () => {
    expect(component.hasClass('harvest-mode')).toBeFalsy();
  });

  it('is present when fieldMode == HARVEST', () => {
    component = shallow(getField({ state: { fieldMode: fieldMode.HARVEST } }));

    expect(component.hasClass('harvest-mode')).toBeTruthy();
  });
});

describe('cleanup-mode class', () => {
  it('is not present when fieldMode != CLEANUP', () => {
    expect(component.hasClass('cleanup-mode')).toBeFalsy();
  });

  it('is present when fieldMode == CLEANUP', () => {
    component = shallow(getField({ state: { fieldMode: fieldMode.CLEANUP } }));

    expect(component.hasClass('cleanup-mode')).toBeTruthy();
  });
});

describe('water-mode class', () => {
  it('is not present when fieldMode != WATER', () => {
    expect(component.hasClass('water-mode')).toBeFalsy();
  });

  it('is present when fieldMode == WATER', () => {
    component = shallow(getField({ state: { fieldMode: fieldMode.WATER } }));

    expect(component.hasClass('water-mode')).toBeTruthy();
  });
});
