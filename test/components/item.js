import React from 'react';
import Item from '../../src/components/item';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('item', () => {
  const getItem = props => <Item {...Object.assign({ name: '' }, props)} />;

  describe('rendering properties', () => {
    beforeEach(() => {
      component = shallow(getItem({ name: 'an-item' }));
    });

    it('renders the name', () => {
      assert.equal(component.find('header').text(), 'an-item');
    });
  });
});
