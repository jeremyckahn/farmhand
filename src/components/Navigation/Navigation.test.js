import React from 'react';
import { Navigation } from './Navigation';
import { shallow } from 'enzyme';
import { stageFocusType } from '../../enums';

let component;

const getNavigation = (props = {}) => (
  <Navigation
    {...{
      handlers: {
        handleViewChange: () => {},
        handleEndDayButtonClick: () => {},
        ...props.handlers,
      },
      gameState: {
        money: 0,
        stageFocus: stageFocusType.FIELD,
        ...props.gameState,
      },
    }}
  />
);

beforeEach(() => {
  component = shallow(getNavigation());
});

test('renders', () => {
  expect(component.hasClass('Navigation')).toBeTruthy();
});
