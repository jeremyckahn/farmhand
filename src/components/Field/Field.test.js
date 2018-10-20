import React from 'react';
import Field from './Field';
import Plot from '../Plot';
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
