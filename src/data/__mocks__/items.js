import { testItem } from '../../test-utils';
import { cropLifeStage } from '../../enums';

const { SEED, GROWING } = cropLifeStage;

// Non-crop items
export const sampleItem1 = testItem({
  id: 'sample-item-1',
  value: 1,
});

export const sampleItem2 = testItem({
  id: 'sample-item-2',
  value: 2,
});

export const sampleItem3 = testItem({
  id: 'sample-item-3',
  value: 3,
});

// Crop items
export const sampleCropSeedsItem1 = testItem({
  enablesFieldMode: 'PLANT',
  id: 'sample-crop-seeds-1',
  isPlantable: true,
  cropType: 'SAMPLE_CROP_TYPE_1',
  growsInto: 'sample-crop-1',
  value: 1,
});

export const sampleCropItem1 = testItem({
  id: 'sample-crop-1',
  cropType: 'SAMPLE_CROP_TYPE_1',
  value: 2,
  cropTimetable: {
    [SEED]: 1,
    [GROWING]: 2,
  },
});

export const sampleCropSeedsItem2 = testItem({
  enablesFieldMode: 'PLANT',
  id: 'sample-crop-seeds-2',
  isPlantable: true,
  cropType: 'SAMPLE_CROP_TYPE_2',
  growsInto: 'sample-crop-2',
  value: 2,
});

export const sampleCropItem2 = testItem({
  id: 'sample-crop-2',
  cropType: 'SAMPLE_CROP_TYPE_2',
  value: 3,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 3,
  },
});

export const sampleCropSeedsItem3 = testItem({
  enablesFieldMode: 'PLANT',
  id: 'sample-crop-seeds-3',
  isPlantable: true,
  cropType: 'SAMPLE_CROP_TYPE_3',
  growsInto: 'sample-crop-3',
  value: 3,
});

export const sampleCropItem3 = testItem({
  id: 'sample-crop-3',
  cropType: 'SAMPLE_CROP_TYPE_3',
  value: 4,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 4,
  },
});

export const sampleFieldTool1 = testItem({
  id: 'sample-field-tool-1',
  enablesFieldMode: 'MOCK_FIELD_MODE_1',
  value: 5,
});

export const fertilizer = testItem({
  id: 'fertilizer',
  value: 60,
  enablesFieldMode: 'FERTILIZE',
});
