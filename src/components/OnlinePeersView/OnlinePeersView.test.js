import React from 'react';
import { shallow } from 'enzyme';

import OnlinePeersView from './OnlinePeersView';

let component;

beforeEach(() => {
  component = shallow(
    <OnlinePeersView {...{
      activePlayers: 0,
      id: '',
      peers: {},
    }} />
  );
});

test('renders', () => {
  expect(component).toHaveLength(1);
});
