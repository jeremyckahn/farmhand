import React from 'react';
import Field from './Field';
import Plot from '../Plot';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getField = props => (
  <Field
    {...{
      columns: 0,
      handlePlotClick: () => {},
      rows: 0,
      selectedPlantableItemId: '',
      ...props,
    }}
  />
);

describe('field rendering', () => {
  beforeEach(() => {
    component = shallow(getField({ columns: 2, rows: 3 }));
  });

  it('renders rows', () => {
    assert.equal(component.find('.row').length, 3);
  });

  it('renders columns', () => {
    assert.equal(
      component
        .find('.row')
        .at(0)
        .find(Plot).length,
      2
    );
  });
});

describe('is-plantable-item-selected class', () => {
  it('is not present when item is not selected', () => {
    assert(!component.hasClass('is-plantable-item-selected'));
  });

  it('is present when item is selected', () => {
    component = shallow(getField({ selectedPlantableItemId: 'stub-item' }));
    assert(component.hasClass('is-plantable-item-selected'));
  });
});
