import { testItem } from '../../test-utils'
import { itemType } from '../../enums'

// Patch the original items data into the mock. This has the potential to break
// with future versions of Webpack (keep an eye on
// https://webpack.js.org/api/module-methods/).
Object.assign(module.exports, jest.requireActual('../items'))

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

export const sampleItem4 = testItem({
  id: 'sample-item-4',
  doesPriceFluctuate: true,
  type: itemType.CROP,
  value: 4,
})

export const sampleItem5 = testItem({
  id: 'sample-item-5',
  doesPriceFluctuate: true,
  type: itemType.CROP,
  value: 5,
})

export const sampleItem6 = testItem({
  id: 'sample-item-6',
  doesPriceFluctuate: true,
  type: itemType.CROP,
  value: 6,
})

export const sampleOre1 = testItem({
  id: 'sample-ore-1',
  doesPriceFluctuate: false,
  name: 'Sample Ore 1',
  type: itemType.FUEL,
  spawnChance: 0.5,
  value: 2,
})

export const craftedItem1 = testItem({
  id: 'sample-crafted-item-1',
  name: 'Sample Crafted Item 1',
  type: itemType.CRAFTED_ITEM,
  value: 100,
})

// Crop items
export const sampleCropSeedsItem1 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_1',
  doesPriceFluctuate: true,
  enablesFieldMode: 'PLANT',
  growsInto: 'sample-crop-1',
  id: 'sample-crop-1-seed',
  name: 'Sample Crop Item Seed 1',
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
  cropTimeline: [1, 2],
})

export const sampleCropSeedsItem2 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_2',
  doesPriceFluctuate: true,
  enablesFieldMode: 'PLANT',
  growsInto: 'sample-crop-2',
  id: 'sample-crop-seed-2',
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
  cropTimeline: [2, 3],
})

export const sampleCropSeedsItem3 = testItem({
  cropType: 'SAMPLE_CROP_TYPE_3',
  doesPriceFluctuate: true,
  enablesFieldMode: 'PLANT',
  growsInto: 'sample-crop-3',
  id: 'sample-crop-seed-3',
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
  cropTimeline: [5, 5],
})

export const sampleFieldTool1 = testItem({
  id: 'sample-field-tool-1',
  enablesFieldMode: 'MOCK_FIELD_MODE_1',
  value: 5,
})

export const sprinkler = testItem({
  enablesFieldMode: 'SET_SPRINKLER',
  id: 'sprinkler',
  name: 'Sprinkler',
  isReplantable: true,
  type: itemType.SPRINKLER,
  value: 120,
})

export const scarecrow = testItem({
  enablesFieldMode: 'SET_SCARECROW',
  id: 'scarecrow',
  name: 'Scarecrow',
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

export const rainbowMilk1 = {
  id: 'rainbow-milk-1',
  name: 'Grade C Rainbow Milk',
  type: itemType.MILK,
  value: 60,
}

export const rainbowMilk2 = {
  id: 'rainbow-milk-2',
  name: 'Grade B Rainbow Milk',
  type: itemType.MILK,
  value: 120,
}

export const rainbowMilk3 = {
  id: 'rainbow-milk-3',
  name: 'Grade A Rainbow Milk',
  type: itemType.MILK,
  value: 180,
}

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

export const chocolateMilk = testItem({
  id: 'chocolate-milk',
  name: 'Chocolate Milk',
  type: itemType.MILK,
  value: 10,
})
