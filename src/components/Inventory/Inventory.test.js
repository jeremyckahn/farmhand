import React from 'react';
import Item from '../Item';
import { shallow } from 'enzyme';
import { testItem } from '../../test-utils';
import { Inventory, getItemCategories, sort } from './Inventory';

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

describe('item sorting', () => {
  test('sorts by type and base value', () => {
    expect(
      sort([
        testItem({ id: 'sample-crop-seeds-2', value: 0.5 }),
        testItem({ id: 'scarecrow' }),
        testItem({ id: 'sprinkler' }),
        testItem({ id: 'sample-crop-seeds-1' }),
      ])
    ).toEqual([
      testItem({ id: 'sample-crop-seeds-1' }),
      testItem({ id: 'sample-crop-seeds-2', value: 0.5 }),
      testItem({ id: 'sprinkler' }),
      testItem({ id: 'scarecrow' }),
    ]);
  });

  test('divides into type categories', () => {
    expect(
      getItemCategories([
        testItem({ id: 'sample-crop-seeds-2' }),
        testItem({ id: 'scarecrow' }),
        testItem({ id: 'sprinkler' }),
        testItem({ id: 'sample-crop-seeds-1' }),
      ])
    ).toEqual({
      seeds: [
        testItem({ id: 'sample-crop-seeds-1' }),
        testItem({ id: 'sample-crop-seeds-2' }),
      ],
      tools: [testItem({ id: 'sprinkler' }), testItem({ id: 'scarecrow' })],
    });
  });
});
