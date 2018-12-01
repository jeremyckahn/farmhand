import { testItem } from '../../test-utils';

export const sampleCrop1 = testItem({
  id: 'sample-crop-1',
  cropTimetable: {
    seed: 1,
    growing: 2,
  },
  cropType: 'SAMPLE',
});

export const sampleCrop2 = testItem({
  id: 'sample-crop-2',
  cropTimetable: {
    seed: 2,
    growing: 3,
  },
  cropType: 'SAMPLE',
});

export const sampleCrop3 = testItem({
  id: 'sample-crop-2',
  cropTimetable: {
    seed: 3,
    growing: 4,
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
