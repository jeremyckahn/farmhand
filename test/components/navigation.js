import React from 'react';
import Navigation from '../../src/components/navigation';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('navigation', () => {
  const getNavigation = props => (
    <Navigation {...Object.assign({}, props)} />
  );

  beforeEach(() => {
    component = shallow(getNavigation());
  });

  it('renders', () => {
    assert(component.hasClass('navigation'));
  });
});
