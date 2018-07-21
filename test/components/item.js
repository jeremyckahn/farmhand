import React from 'react';
import Item from '../../src/components/item';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('item', () => {
  const getItem = props => (
    <Item {...Object.assign({ item: { name: '' } }, props)} />
  );

  describe('static UI', () => {
    beforeEach(() => {
      component = shallow(getItem({ item: { name: 'an-item' } }));
    });

    it('renders the name', () => {
      assert.equal(component.find('header').text(), 'an-item');
    });
  });

  describe('conditional UI', () => {
    describe('purchase button', () => {
      beforeEach(() => {
        component = shallow(
          getItem({ item: { name: 'an-item' }, handlePurchaseItem: () => {} })
        );
      });

      it('renders a purchase button', () => {
        assert.equal(component.find('button.purchase').length, 1);
      });
    });
  });
});
