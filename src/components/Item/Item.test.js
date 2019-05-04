import React from 'react';
import { Item } from './Item';
import { shallow } from 'enzyme';
import { testItem } from '../../test-utils';

let component;

beforeEach(() => {
  component = shallow(
    <Item
      {...{
        item: testItem({ name: '' }),
        money: 0,
      }}
    />
  );
});

describe('static UI', () => {
  beforeEach(() => {
    component.setProps({ item: testItem({ name: 'an-item' }) });
  });

  test('renders the name', () => {
    expect(component.find('header h2').text()).toEqual('an-item');
  });
});

describe('conditional UI', () => {
  describe('class names', () => {
    beforeEach(() => {
      component.setProps({ isSelected: true });
    });

    test('supports is-selected', () => {
      expect(component.hasClass('is-selected')).toBeTruthy();
    });
  });

  describe('isPurchaseView', () => {
    describe('user has enough money', () => {
      beforeEach(() => {
        component.setProps({
          isPurchaseView: true,
          item: testItem({ name: 'an-item' }),
          money: 50,
        });
      });

      test('enables purchase button', () => {
        expect(component.find('button.purchase').props().disabled).toEqual(
          false
        );
      });
    });

    describe('user does not have enough money', () => {
      beforeEach(() => {
        component.setProps({
          isPurchaseView: true,
          item: testItem({ name: 'an-item', value: 10 }),
          money: 5,
        });
      });

      test('disables purchase button', () => {
        expect(component.find('button.purchase').props().disabled).toEqual(
          true
        );
      });
    });
  });

  describe('isSellView', () => {
    beforeEach(() => {
      component.setProps({
        isSellView: true,
        item: testItem({ name: 'an-item' }),
      });
    });

    test('renders sell button when given an event handler', () => {
      expect(component.find('button.sell')).toHaveLength(1);
    });
  });
});
