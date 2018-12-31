import React from 'react';
import ContextPane from './ContextPane';
import { stageFocusType } from '../../../src/enums';
import PlantableItems from '../PlantableItems';
import { shallow } from 'enzyme';

let component;

const getContextPane = (props = {}) => (
  <ContextPane
    {...{
      handlers: {
        handlePlantableItemSelect: () => {},
        handleToolSelect: () => {},
        ...props.handlers,
      },
      state: {
        selectedPlantableItemId: '',
        selectedTool: '',
        stageFocus: stageFocusType.NONE,
        plantableInventory: [],
        ...props.state,
      },
    }}
  />
);

beforeEach(() => {
  component = shallow(getContextPane());
});

describe('conditional UI', () => {
  describe('stageFocus', () => {
    describe('stageFocus === stageFocusType.FIELD', () => {
      beforeEach(() => {
        component = shallow(
          getContextPane({ state: { stageFocus: stageFocusType.FIELD } })
        );
      });

      it('renders relevant UI', () => {
        expect(component.find(PlantableItems)).toHaveLength(1);
      });
    });
  });
});
