import { testItem } from '../../test-utils'
import { cropLifeStage, itemType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

// Non-crop items
export const sampleItem1 = testItem({
  id: 'sample-item-1',
  doesPriceFluctuate: true,
  type: itemType.CROP,
  value: 1,
})

export const sampleItem2 = testItem({
  id: 'sample-item-2',
  doesPriceFluctuate: true,
  type: itemType.CROP,
  value: 2,
})

export const sampleItem3 = testItem({
  id: 'sample-item-3',
  doesPriceFluctuate: true,
  type: itemType.CROP,
  value: 3,
})

// Crop items
export const sampleCropSeedsItem1 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_1',
  doesPriceFluctuate: true,
  enablesFieldMode: 'PLANT',
  growsInto: 'sample-crop-1',
  id: 'sample-crop-seeds-1',
  isPlantableCrop: true,
  type: itemType.CROP,
  value: 1,
})

export const sampleCropItem1 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_1',
  doesPriceFluctuate: true,
  id: 'sample-crop-1',
  name: 'Sample Crop Item 1',
  type: itemType.CROP,
  value: 2,
  cropTimetable: {
    [SEED]: 1,
    [GROWING]: 2,
  },
})

export const sampleCropSeedsItem2 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_2',
  doesPriceFluctuate: true,
  enablesFieldMode: 'PLANT',
  growsInto: 'sample-crop-2',
  id: 'sample-crop-seeds-2',
  isPlantableCrop: true,
  type: itemType.CROP,
  value: 2,
})

export const sampleCropItem2 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_2',
  doesPriceFluctuate: true,
  id: 'sample-crop-2',
  name: 'Sample Crop Item 2',
  type: itemType.CROP,
  value: 3,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 3,
  },
})

export const sampleCropSeedsItem3 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_3',
  doesPriceFluctuate: true,
  enablesFieldMode: 'PLANT',
  growsInto: 'sample-crop-3',
  id: 'sample-crop-seeds-3',
  isPlantableCrop: true,
  value: 3,
})

export const sampleCropItem3 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_3',
  doesPriceFluctuate: true,
  id: 'sample-crop-3',
  name: 'Sample Crop Item 3',
  type: itemType.CROP,
  value: 4,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 4,
  },
})

export const sampleFieldTool1 = testItem({
  id: 'sample-field-tool-1',
  enablesFieldMode: 'MOCK_FIELD_MODE_1',
  value: 5,
})

export const fertilizer = testItem({
  id: 'fertilizer',
  value: 60,
  enablesFieldMode: 'FERTILIZE',
})

export const sprinkler = testItem({
  enablesFieldMode: 'SET_SPRINKLER',
  id: 'sprinkler',
  isReplantable: true,
  type: itemType.SPRINKLER,
  value: 120,
})

export const scarecrow = testItem({
  enablesFieldMode: 'SET_SCARECROW',
  id: 'scarecrow',
  isReplantable: true,
  type: itemType.SCARECROW,
  value: 160,
})

export const milk1 = testItem({
  id: 'milk-1',
  name: 'Milk 1',
  type: itemType.MILK,
  value: 5,
})

export const milk2 = testItem({
  id: 'milk-2',
  name: 'Milk 2',
  type: itemType.MILK,
  value: 10,
})

export const milk3 = testItem({
  id: 'milk-3',
  name: 'Milk 3',
  type: itemType.MILK,
  value: 15,
})

export const cowFeed = testItem({
  id: 'cow-feed',
  name: 'Cow Feed',
  type: itemType.COW_FEED,
  value: 5,
})

export const huggingMachine = testItem({
  id: 'hugging-machine',
  name: 'Hugging Machine',
  type: itemType.HUGGING_MACHINE,
  value: 500,
})

export const replantableItem = testItem({
  id: 'replantable-item',
  isReplantable: true,
  type: 'MOCK_TYPE',
})
