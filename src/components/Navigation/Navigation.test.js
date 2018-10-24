import React from 'react';
import Navigation from './';
import { shallow } from 'enzyme';

let component;

const getNavigation = (props = {}) => (
  <Navigation
    {...{
      handlers: {
        handleChangeView: () => {},
        handleClickEndDayButton: () => {},
        ...props.handlers,
      },
      state: { money: 0, ...props.state },
    }}
  />
);

beforeEach(() => {
  component = shallow(getNavigation());
});

it('renders', () => {
  expect(component.hasClass('Navigation')).toBeTruthy();
});
