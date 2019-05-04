import React from 'react';
import Item from '../Item';
import { shallow } from 'enzyme';
import { testItem } from '../../test-utils';
import { Inventory } from './Inventory';

jest.mock('../../data/maps');
jest.mock('../../data/items');

let component;

beforeEach(() => {
  component = shallow(
    <Inventory
      {...{
        items: [],
        valueAdjustments: {},
      }}
    />
  );
});

describe('rendering items', () => {
  test('shows the inventory', () => {
    component.setProps({ items: [testItem({ id: 'sample-item-1' })] });

    const li = component.find('li');
    expect(li).toHaveLength(1);
    expect(li.find(Item)).toHaveLength(1);
  });
});
