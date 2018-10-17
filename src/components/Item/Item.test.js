import React from 'react';
import Item from './';
import { shallow } from 'enzyme';
import assert from 'assert';
import { testItem } from '../../test-utils';

let component;

const getItem = (props = {}) => (
  <Item
    {...{
      handlers: { ...props.handlers },
      item: testItem({ name: '' }),
      state: { money: 0, ...props.state },
      ...props.options,
    }}
  />
);

describe('static UI', () => {
  beforeEach(() => {
    component = shallow(
      getItem({ options: { item: testItem({ name: 'an-item' }) } })
    );
  });

  it('renders the name', () => {
    assert.equal(component.find('header h2').text(), 'an-item');
  });
});

describe('conditional UI', () => {
  describe('class names', () => {
    beforeEach(() => {
      component = shallow(getItem({ options: { isSelected: true } }));
    });

    it('supports is-selected', () => {
      assert(component.hasClass('is-selected'));
    });
  });

  describe('isPurchaseView', () => {
    describe('user has enough money', () => {
      beforeEach(() => {
        component = shallow(
          getItem({
            options: {
              isPurchaseView: true,
              item: testItem({ name: 'an-item' }),
            },
            state: { money: 50 },
          })
        );
      });

      it('enables purchase button', () => {
        assert.equal(component.find('button.purchase').props().disabled, false);
      });
    });

    describe('user does not have enough money', () => {
      beforeEach(() => {
        component = shallow(
          getItem({
            options: {
              isPurchaseView: true,
              item: testItem({ name: 'an-item', value: 10 }),
            },
            state: { money: 5 },
          })
        );
      });

      it('disables purchase button', () => {
        assert.equal(component.find('button.purchase').props().disabled, true);
      });
    });
  });

  describe('isSellView', () => {
    beforeEach(() => {
      component = shallow(
        getItem({
          options: {
            isSellView: true,
            item: testItem({ name: 'an-item' }),
          },
        })
      );
    });

    it('renders sell button when given an event handler', () => {
      assert.equal(component.find('button.sell').length, 1);
    });
  });
});
