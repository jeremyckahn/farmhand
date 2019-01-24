import React from 'react';
import Farmhand from './Farmhand';
import { stageFocusType, fieldMode } from './enums';
import { shallow } from 'enzyme';
import { testItem } from './test-utils';

jest.mock('./data/items');

let component;

const handlers = () => component.instance().handlers;

beforeEach(() => {
  component = shallow(<Farmhand />);
});

describe('handleItemPurchase', () => {
  it('calls purchaseItem', () => {
    jest
      .spyOn(component.instance(), 'purchaseItem')
      .mockImplementation(() => {});
    handlers().handleItemPurchase(testItem({ id: 'sample-item-1' }));

    expect(component.instance().purchaseItem).toHaveBeenCalledWith(
      testItem({ id: 'sample-item-1' })
    );
  });
});

describe('handleItemSell', () => {
  it('calls sellItem', () => {
    jest.spyOn(component.instance(), 'sellItem').mockImplementation(() => {});
    handlers().handleItemSell(testItem({ id: 'sample-item-1' }));

    expect(component.instance().sellItem).toHaveBeenCalledWith(
      testItem({ id: 'sample-item-1' })
    );
  });
});

describe('handleViewChange', () => {
  beforeEach(() => {
    handlers().handleViewChange({ target: { value: stageFocusType.SHOP } });
  });

  it('changes the view type', () => {
    expect(component.state('stageFocus')).toEqual(stageFocusType.SHOP);
  });
});

describe('handlePlantableItemSelect', () => {
  beforeEach(() => {
    component.setState({
      fieldMode: fieldMode.WATER,
    });

    handlers().handlePlantableItemSelect(testItem({ id: 'sample-crop-3' }));
  });

  it('updates selectedPlantableItemId state', () => {
    expect(component.state().selectedPlantableItemId).toEqual('sample-crop-3');
  });

  it('resets state.fieldMode', () => {
    expect(component.state().fieldMode).toEqual(fieldMode.PLANT);
  });
});

describe('handleFieldModeSelect', () => {
  beforeEach(() => {
    component.setState({
      selectedPlantableItemId: 'sample-crop-3',
    });
  });

  describe('fieldMode === PLANT', () => {
    beforeEach(() => {
      handlers().handleFieldModeSelect(fieldMode.PLANT);
    });

    it('updates fieldMode state', () => {
      expect(component.state().fieldMode).toEqual(fieldMode.PLANT);
    });

    it('does not change state.selectedPlantableItemId', () => {
      expect(component.state().selectedPlantableItemId).toEqual(
        'sample-crop-3'
      );
    });
  });

  describe('fieldMode !== PLANT', () => {
    beforeEach(() => {
      handlers().handleFieldModeSelect(fieldMode.WATER);
    });

    it('updates fieldMode state', () => {
      expect(component.state().fieldMode).toEqual(fieldMode.WATER);
    });

    it('resets state.selectedPlantableItemId', () => {
      expect(component.state().selectedPlantableItemId).toEqual('');
    });
  });
});

describe('handlePlotClick', () => {
  beforeEach(() => {
    component.setState({
      selectedPlantableItemId: 'sample-crop-3',
    });
  });

  describe('fieldMode === fieldMode.PLANT', () => {
    beforeEach(() => {
      component.setState({
        fieldMode: fieldMode.PLANT,
        selectedPlantableItemId: 'sample-crop-3',
      });
    });

    it('calls plantInPlot', () => {
      jest.spyOn(component.instance(), 'plantInPlot').mockImplementation();
      handlers().handlePlotClick(0, 0);

      expect(component.instance().plantInPlot).toHaveBeenCalledWith(
        0,
        0,
        'sample-crop-3'
      );
    });
  });

  describe('fieldMode === fieldMode.HARVEST', () => {
    beforeEach(() => {
      component.setState({
        fieldMode: fieldMode.HARVEST,
      });
    });

    it('calls clearPlot', () => {
      jest.spyOn(component.instance(), 'clearPlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().clearPlot).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('fieldMode === fieldMode.CLEANUP', () => {
    beforeEach(() => {
      component.setState({
        fieldMode: fieldMode.CLEANUP,
      });
    });

    it('calls waterPlot', () => {
      jest.spyOn(component.instance(), 'harvestPlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().harvestPlot).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('fieldMode === fieldMode.WATER', () => {
    beforeEach(() => {
      component.setState({
        fieldMode: fieldMode.WATER,
      });
    });

    it('calls waterPlot', () => {
      jest.spyOn(component.instance(), 'waterPlot');
      handlers().handlePlotClick(0, 0);

      expect(component.instance().waterPlot).toHaveBeenCalledWith(0, 0);
    });
  });
});

describe('handleEndDayButtonClick', () => {
  it('increments the day', () => {
    jest.spyOn(component.instance(), 'incrementDay');
    handlers().handleEndDayButtonClick();
    expect(component.instance().incrementDay).toHaveBeenCalled();
  });
});
