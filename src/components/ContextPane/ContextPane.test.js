import React from 'react';
import { ContextPane } from './ContextPane';
import { stageFocusType } from '../../../src/enums';
import PlantableItems from '../PlantableItems';
import { shallow } from 'enzyme';

let component;

const getContextPane = (props = {}) => (
  <ContextPane
    {...{
      handlers: {
        handleFieldModeSelect: () => {},
        handleItemSelect: () => {},
        ...props.handlers,
      },
      gameState: {
        selectedItemId: '',
        fieldMode: '',
        fieldToolInventory: [],
        stageFocus: stageFocusType.NONE,
        plantableInventory: [],
        ...props.gameState,
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
          getContextPane({ gameState: { stageFocus: stageFocusType.FIELD } })
        );
      });

      test('renders relevant UI', () => {
        expect(component.find(PlantableItems)).toHaveLength(1);
      });
    });
  });
});
