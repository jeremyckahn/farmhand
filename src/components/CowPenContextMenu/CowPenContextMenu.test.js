import React from 'react';
import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';

import { CowPenContextMenu } from './CowPenContextMenu';

let component;

beforeEach(() => {
  component = shallow(
    <CowPenContextMenu
      {...{
        cowForSale: {
          name: '',
          weight: 100,
        },
        handleCowPurchaseClick: () => {},
        money: 0,
      }}
    />
  );
});

test('renders', () => {
  expect(component).toHaveLength(1);
});

describe('cow purchase button', () => {
  describe('player does not have enough money', () => {
    test('button is disabled', () => {
      component.setProps({
        money: 100,
      });

      expect(component.find(Button).props().disabled).toBe(true);
    });
  });

  describe('player has enough money', () => {
    test('button is not disabled', () => {
      component.setProps({
        money: 150,
      });

      expect(component.find(Button).props().disabled).toBe(false);
    });
  });
});
