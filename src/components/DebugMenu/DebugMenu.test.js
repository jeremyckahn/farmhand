import React from 'react';
import { DebugMenu } from './DebugMenu';
import { shallow } from 'enzyme';

let component;

beforeEach(() => {
  component = shallow(
    <DebugMenu
      {...{
        handleClearPersistedDataClick: () => {},
        handleWaterAllPlotsClick: () => {},
      }}
    />
  );
});

test('renders Debug', () => {
  expect(component).toHaveLength(1);
});
