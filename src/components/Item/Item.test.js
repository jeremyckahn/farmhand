/* eslint-disable import/first */
jest.mock('../../img');

import React from 'react';
import Item from './';
import { shallow } from 'enzyme';
import { testItem } from '../../test-utils';
import { items as itemImages } from '../../img';

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
    expect(component.find('header h2').text()).toEqual('an-item');
  });
});

describe('conditional UI', () => {
  describe('class names', () => {
    beforeEach(() => {
      component = shallow(getItem({ options: { isSelected: true } }));
    });

    it('supports is-selected', () => {
      expect(component.hasClass('is-selected')).toBeTruthy();
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
        expect(component.find('button.purchase').props().disabled).toEqual(
          false
        );
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
        expect(component.find('button.purchase').props().disabled).toEqual(
          true
        );
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
      expect(component.find('button.sell').length).toEqual(1);
    });
  });

  describe('image', () => {
    beforeEach(() => {
      component = shallow(
        getItem({
          options: {
            item: testItem({ id: 'sample-item-1' }),
          },
        })
      );
    });

    it("defaults to provided item's image", () => {
      expect(component.find('img').props().src).toBe(
        itemImages['sample-item-1']
      );
    });

    it('renders provided image data', () => {
      const image = 'data:image/png;base64,some-other-image';
      component.setProps({ image });

      expect(component.find('img').props().src).toBe(image);
    });
  });
});
