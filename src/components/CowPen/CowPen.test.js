import React from 'react';
import { shallow } from 'enzyme';

import { generateCow } from '../../utils';
import { cowColors } from '../../enums';
import { animals } from '../../img';

import { Cow, CowPen } from './CowPen';

let component;

jest.useFakeTimers();

beforeEach(() => {
  component = shallow(<CowPen {...{ cowInventory: [] }} />);
});

test('renders', () => {
  expect(component).toHaveLength(1);
});

describe('Cow', () => {
  let subcomponent;

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    subcomponent = shallow(
      <Cow
        {...{
          cow: {
            ...generateCow(),
            color: cowColors.WHITE,
          },
        }}
      />
    );
  });

  test('has correct image', () => {
    expect(subcomponent.find('img').props().src).toEqual(
      animals.cow[cowColors.WHITE.toLowerCase()]
    );
  });

  describe('movement', () => {
    test('schedules a position change at boot', () => {
      expect(setTimeout).toHaveBeenCalledWith(subcomponent.instance().move, 0);
    });

    describe('move', () => {
      test('updates state', () => {
        subcomponent.instance().move();
        expect(subcomponent.state().isMoving).toEqual(true);
      });
    });

    describe('finishMoving', () => {
      test('updates state', () => {
        subcomponent.setState({ isMoving: true });
        subcomponent.instance().finishMoving();
        expect(subcomponent.state().isMoving).toEqual(false);
      });
    });
  });
});
