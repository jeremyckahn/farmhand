import { testItem } from '../../test-utils';
import { cropLifeStage, plotContentType } from '../../enums';

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
  cropType: 'SAMPLE_CROP_TYPE_1',
  enablesFieldMode: 'PLANT',
  growsInto: 'sample-crop-1',
  id: 'sample-crop-seeds-1',
  isPlantableCrop: true,
  type: plotContentType.CROP,
  value: 1,
});

export const sampleCropItem1 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_1',
  id: 'sample-crop-1',
  name: 'Sample Crop Item 1',
  type: plotContentType.CROP,
  value: 2,
  cropTimetable: {
    [SEED]: 1,
    [GROWING]: 2,
  },
});

export const sampleCropSeedsItem2 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_2',
  enablesFieldMode: 'PLANT',
  growsInto: 'sample-crop-2',
  id: 'sample-crop-seeds-2',
  isPlantableCrop: true,
  type: plotContentType.CROP,
  value: 2,
});

export const sampleCropItem2 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_2',
  id: 'sample-crop-2',
  name: 'Sample Crop Item 2',
  type: plotContentType.CROP,
  value: 3,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 3,
  },
});

export const sampleCropSeedsItem3 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_3',
  enablesFieldMode: 'PLANT',
  growsInto: 'sample-crop-3',
  id: 'sample-crop-seeds-3',
  isPlantableCrop: true,
  value: 3,
});

export const sampleCropItem3 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_3',
  id: 'sample-crop-3',
  name: 'Sample Crop Item 3',
  type: plotContentType.CROP,
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

export const sprinkler = testItem({
  enablesFieldMode: 'SET_SPRINKLER',
  id: 'sprinkler',
  isReplantable: true,
  type: plotContentType.SPRINKLER,
  value: 120,
});

export const scarecrow = testItem({
  enablesFieldMode: 'SET_SCARECROW',
  id: 'scarecrow',
  isReplantable: true,
  type: plotContentType.SCARECROW,
  value: 160,
});

export const replantableItem = testItem({
  id: 'replantable-item',
  isReplantable: true,
  type: 'MOCK_TYPE',
});
