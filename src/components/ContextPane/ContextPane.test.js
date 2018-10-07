import React from 'react';
import ContextPane from './ContextPane';
import { stageFocusType } from '../../../src/enums';
import PlantableItems from '../PlantableItems';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

const getContextPane = props => (
  <ContextPane
    {...{
      stageFocus: stageFocusType.NONE,
      ...props,
    }}
  />
);

beforeEach(() => {
  component = shallow(getContextPane());
});

it('renders', () => {
  assert.equal(component.length, 1);
});

describe('conditional UI', () => {
  describe('stageFocus', () => {
    describe('stageFocus === stageFocusType.FIELD', () => {
      beforeEach(() => {
        component = shallow(
          getContextPane({ stageFocus: stageFocusType.FIELD })
        );
      });

      it('renders relevant UI', () => {
        assert.equal(component.find(PlantableItems).length, 1);
      });
    });
  });
});
