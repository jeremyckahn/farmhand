import { testItem } from '../../test-utils';

export const sampleCrop1 = testItem({
  id: 'sample-crop-1',
  cropTimetable: {
    germinate: 1,
    grow: 2,
    flower: 3,
  },
  cropType: 'SAMPLE',
});

export const sampleCrop2 = testItem({
  id: 'sample-crop-2',
  cropTimetable: {
    germinate: 2,
    grow: 3,
    flower: 4,
  },
  cropType: 'SAMPLE',
});

export const sampleCrop3 = testItem({
  id: 'sample-crop-2',
  cropTimetable: {
    germinate: 3,
    grow: 4,
    flower: 5,
  },
  cropType: 'SAMPLE',
});

export const sampleItem1 = testItem({ id: 'sample-item-1', value: 1 });
export const sampleItem2 = testItem({ id: 'sample-item-2', value: 2 });
export const sampleItem3 = testItem({
  id: 'sample-item-3',
  value: 3,
  isPlantable: true,
});
