import React from 'react';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import { shallow } from 'enzyme';

import { testItem } from '../../test-utils';

import { Item } from './Item';

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
    expect(component.find(CardHeader).props().title).toEqual('an-item');
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
        const buttonProps = component.find(Button).props();

        expect(buttonProps.className).toContain('purchase');
        expect(buttonProps.disabled).toEqual(false);
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
        const buttonProps = component.find(Button).props();

        expect(buttonProps.className).toContain('purchase');
        expect(buttonProps.disabled).toEqual(true);
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

    test('renders sell buttons', () => {
      expect(component.find('.sell')).toHaveLength(1);
      expect(component.find('.sell-all')).toHaveLength(1);
    });
  });
});
