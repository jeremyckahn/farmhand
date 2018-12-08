import { testItem } from '../../test-utils';

// Non-crop items
export const sampleItem1 = testItem({
  id: 'sample-item-1',
  cropType: 'SAMPLE-ITEM-TYPE-1',
  value: 1,
});

export const sampleItem2 = testItem({
  id: 'sample-item-2',
  cropType: 'SAMPLE-ITEM-TYPE-2',
  value: 2,
});

export const sampleItem3 = testItem({
  id: 'sample-item-3',
  cropType: 'SAMPLE-ITEM-TYPE-3',
  value: 3,
});

// Crop items
export const sampleCropSeedsItem1 = testItem({
  id: 'sample-crop-seeds-1',
  isPlantable: true,
  cropType: 'SAMPLE-CROP-TYPE-1',
  growsInto: 'sample-crop-1',
  value: 1,
});

export const sampleCropItem1 = testItem({
  id: 'sample-crop-1',
  cropType: 'SAMPLE-CROP-TYPE-1',
  value: 2,
  cropTimetable: {
    seed: 1,
    growing: 2,
  },
});

export const sampleCropSeedsItem2 = testItem({
  id: 'sample-crop-seeds-2',
  isPlantable: true,
  cropType: 'SAMPLE-CROP-TYPE-2',
  growsInto: 'sample-crop-2',
  value: 2,
});

export const sampleCropItem2 = testItem({
  id: 'sample-crop-2',
  cropType: 'SAMPLE-CROP-TYPE-2',
  value: 3,
  cropTimetable: {
    seed: 2,
    growing: 3,
  },
});

export const sampleCropSeedsItem3 = testItem({
  id: 'sample-crop-seeds-3',
  isPlantable: true,
  cropType: 'SAMPLE-CROP-TYPE-3',
  growsInto: 'sample-crop-3',
  value: 3,
});

export const sampleCropItem3 = testItem({
  id: 'sample-crop-3',
  cropType: 'SAMPLE-CROP-TYPE-3',
  value: 4,
  cropTimetable: {
    seed: 3,
    growing: 4,
  },
});
