import React from 'react';
import FieldTools from './FieldTools';
import Item from '../Item';
import { shallow } from 'enzyme';

let component;

const getFieldTools = (props = {}) => (
  <FieldTools
    {...{
      handlers: {
        handleItemSelect: () => {},
        ...props.handlers,
      },
      state: {
        fieldToolInventory: [],
        selectedItemId: '',
        ...props.state,
      },
    }}
  />
);

beforeEach(() => {
  component = shallow(
    getFieldTools({
      state: {
        fieldToolInventory: [{ quantity: 1, id: 'sample-field-tool-1' }],
        selectedItemId: 'sample-field-tool-1',
      },
    })
  );
});

describe('rendering', () => {
  test('renders items for provided inventory', () => {
    expect(component.find(Item)).toHaveLength(1);
  });

  test('renders selected item state', () => {
    expect(component.find(Item).props().isSelected).toBeTruthy();
  });
});
