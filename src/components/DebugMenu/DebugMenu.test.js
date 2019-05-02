import React from 'react';
import { DebugMenu } from './DebugMenu';
import { shallow } from 'enzyme';

let component;

const getDebugMenu = (props = {}) => (
  <DebugMenu
    {...{
      handlers: {
        handleClearPersistedDataClick: () => {},
        handleWaterAllPlotsClick: () => {},
        ...props.handlers,
      },
      items: [],
      state: {
        ...props.state,
      },
      ...props.options,
    }}
  />
);

beforeEach(() => {
  component = shallow(getDebugMenu());
});

test('renders Debug', () => {
  expect(component).toHaveLength(1);
});
