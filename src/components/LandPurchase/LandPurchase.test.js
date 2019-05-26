import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { shallow } from 'enzyme';

import { PURCHASEABLE_FIELD_SIZES } from '../../constants';

import { LandPurchase } from './LandPurchase';

jest.mock('../../constants');

let component;

beforeEach(() => {
  component = shallow(
    <LandPurchase
      {...{
        handleFieldPurchase: () => {},
        purchasedField: 0,
        money: 0,
      }}
    />
  );
});

test('renders field options', () => {
  expect(component.find(MenuItem)).toHaveLength(PURCHASEABLE_FIELD_SIZES.size);
});

describe('option rendering', () => {
  describe('user does not have enough money for option', () => {
    test('option is disabled', () => {
      expect(
        component
          .find(MenuItem)
          .first()
          .props().disabled
      ).toBeTruthy();
    });
  });

  describe('unpurchased options', () => {
    describe('user has enough money for option', () => {
      test('option is not disabled', () => {
        component.setProps({
          purchasedField: 0,
          money: PURCHASEABLE_FIELD_SIZES.get(1).price,
        });

        expect(
          component
            .find(MenuItem)
            .first()
            .props().disabled
        ).toBeFalsy();
      });
    });
  });

  describe('purchased options', () => {
    test('option is disabled', () => {
      component.setProps({
        purchasedField: 1,
        money: Number.MAX_VALUE,
      });

      expect(
        component
          .find(MenuItem)
          .first()
          .props().disabled
      ).toBeTruthy();
    });
  });
});

describe('getters', () => {
  describe('canPlayerBuySelectedOption', () => {
    beforeEach(() => {
      component.setState({ selectedOption: '1' });
    });

    describe('player can not buy selected option', () => {
      test('button is enabled', () => {
        expect(component.instance().canPlayerBuySelectedOption).toBeFalsy();
      });
    });

    describe('player can buy selected option', () => {
      test('button is enabled', () => {
        component.setProps({
          purchasedField: 0,
          money: 100000,
        });

        expect(component.instance().canPlayerBuySelectedOption).toBeTruthy();
      });
    });
  });
});

describe('handleFieldPurchase', () => {
  let handleFieldPurchase;

  beforeEach(() => {
    handleFieldPurchase = jest.fn();
    component.setProps({ handleFieldPurchase });
    component.setState({ selectedOption: 2 });
  });

  describe('user does not have enough money', () => {
    test('does not call handleFieldPurchase prop', () => {
      component.instance().handleFieldPurchase();
      expect(handleFieldPurchase).not.toHaveBeenCalled();
    });
  });

  describe('user has enough money', () => {
    test('does call handleFieldPurchase prop', () => {
      component.setProps({ purchasedField: 0, money: 2000 });
      component.instance().handleFieldPurchase();
      expect(handleFieldPurchase).toHaveBeenCalledWith(2);
    });
  });
});

describe('updateSelectedOption', () => {
  beforeEach(() => {
    component.setState({ selectedOption: '1' });
  });

  describe('player does not have enough money for next field option', () => {
    test('does not update selectedOption', () => {
      component.setProps({ purchasedField: 1, money: 0 });
      component.instance().updateSelectedOption();

      expect(component.state().selectedOption).toEqual('1');
    });
  });

  describe('player has enough money for next field option', () => {
    test('updates selectedOption', () => {
      component.setProps({ purchasedField: 1, money: 2000 });
      component.instance().updateSelectedOption();

      expect(component.state().selectedOption).toEqual('2');
    });
  });
});
