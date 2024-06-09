/** @typedef {import("../../index").farmhand.item} farmhand.item */
/** @typedef {import("../../index").farmhand.grape} farmhand.grape */
/** @typedef {import("../../index").farmhand.cropVariety} farmhand.cropVariety */

import { crop, fromSeed, cropVariety } from '../crop'
import { cropFamily, cropType, grapeVariety } from '../../enums'

/**
 * @param {farmhand.item | farmhand.cropVariety} item
 * @returns {item is farmhand.grape}
 */
export const isGrape = item => {
  return 'cropFamily' in item && item.cropFamily === cropFamily.GRAPE
}

/**
 * @param {Omit<farmhand.cropVariety, 'cropFamily'> & { wineId: string }} grapeProps
 * @returns {farmhand.grape}
 */
const grape = grapeProps => {
  const newGrape = {
    ...cropVariety({ ...grapeProps, cropFamily: cropFamily.GRAPE }),
  }

  if (!isGrape(newGrape)) {
    throw new Error(`Invalid cropVariety props`)
  }

  return newGrape
}

/**
 * @property farmhand.module:items.grapeSeed
 * @type {farmhand.item}
 */
export const grapeSeed = crop({
  cropType: cropType.GRAPE,
  cropTimeline: [3, 4],
  growsInto: [
    'grape-chardonnay',
    'grape-sauvignon-blanc',
    // 'grape-pinot-blanc',
    // 'grape-muscat',
    // 'grape-riesling',
    // 'grape-merlot',
    'grape-cabernet-sauvignon',
    // 'grape-syrah',
    'grape-tempranillo',
    'grape-nebbiolo',
  ],
  id: 'grape-seed',
  name: 'Grape Seed',
  tier: 7,
})

/**
 * @type {Record<grapeVariety, string>}
 */
export const grapeVarietyNameMap = {
  [grapeVariety.CHARDONNAY]: 'Chardonnay',
  [grapeVariety.SAUVIGNON_BLANC]: 'Sauvignon Blanc',
  //[grapeVariety.PINOT_BLANC]: 'Pinot Blanc',
  //[grapeVariety.MUSCAT]: 'Muscat',
  //[grapeVariety.RIESLING]: 'Riesling',
  //[grapeVariety.MERLOT]: 'Merlot',
  [grapeVariety.CABERNET_SAUVIGNON]: 'Cabernet Sauvignon',
  //[grapeVariety.SYRAH]: 'Syrah',
  [grapeVariety.TEMPRANILLO]: 'Tempranillo',
  [grapeVariety.NEBBIOLO]: 'Nebbiolo',
}

/**
 * @type {Record<grapeVariety, number>} The number value represents a wine's
 * value relative to a baseline of 1. Must be an integer.
 */
export const wineVarietyValueMap = {
  [grapeVariety.CHARDONNAY]: 1,
  [grapeVariety.SAUVIGNON_BLANC]: 8,
  //[grapeVariety.PINOT_BLANC]: 2,
  //[grapeVariety.MUSCAT]: 4,
  //[grapeVariety.RIESLING]: 7,
  //[grapeVariety.MERLOT]: 6,
  [grapeVariety.CABERNET_SAUVIGNON]: 3,
  //[grapeVariety.SYRAH]: 9,
  [grapeVariety.TEMPRANILLO]: 5,
  [grapeVariety.NEBBIOLO]: 10,
}

/**
 * @property farmhand.module:items.grapeChardonnay
 * @type {farmhand.grape}
 */
export const grapeChardonnay = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-chardonnay'),
  }),
  name: 'Chardonnay Grape',
  imageId: 'grape-green',
  variety: grapeVariety.CHARDONNAY,
  wineId: 'wine-chardonnay',
})

/**
 * @property farmhand.module:items.grapeSauvignonBlanc
 * @type {farmhand.grape}
 */
export const grapeSauvignonBlanc = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-sauvignon-blanc'),
  }),
  name: 'Sauvignon Blanc Grape',
  imageId: 'grape-green',
  variety: grapeVariety.SAUVIGNON_BLANC,
  wineId: 'wine-sauvignon-blanc',
})

/**
 * @property farmhand.module:items.grapePinotBlanc
 * @type {farmhand.grape}
 */
// export const grapePinotBlanc = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-pinot-blanc') }),
// name: 'Pinot Blanc Grape',
// imageId: 'grape-green',
// variety: grapeVariety.PINOT_BLANC,
// wineId: 'wine-pinot-blanc',
// })

/**
 * @property farmhand.module:items.grapeMuscat
 * @type {farmhand.grape}
 */
// export const grapeMuscat = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-muscat') }),
// name: 'Muscat Grape',
// imageId: 'grape-green',
// variety: grapeVariety.MUSCAT,
// wineId: 'wine-muscat',
// })

/**
 * @property farmhand.module:items.grapeRiesling
 * @type {farmhand.grape}
 */
// export const grapeRiesling = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-riesling') }),
// name: 'Riesling Grape',
// imageId: 'grape-green',
// variety: grapeVariety.RIESLING,
// wineId: 'wine-riesling',
// })

/**
 * @property farmhand.module:items.grapeMerlot
 * @type {farmhand.grape}
 */
// export const grapeMerlot = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-merlot') }),
// name: 'Merlot Grape',
// imageId: 'grape-purple',
// variety: grapeVariety.MERLOT,
// wineId: 'wine-merlot',
// })

/**
 * @property farmhand.module:items.grapeCabernetSauvignon
 * @type {farmhand.grape}
 */
export const grapeCabernetSauvignon = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-cabernet-sauvignon'),
  }),
  name: 'Cabernet Sauvignon Grape',
  imageId: 'grape-purple',
  variety: grapeVariety.CABERNET_SAUVIGNON,
  wineId: 'wine-cabernet-sauvignon',
})

/**
 * @property farmhand.module:items.grapeSyrah
 * @type {farmhand.grape}
 */
// export const grapeSyrah = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-syrah') }),
// name: 'Syrah Grape',
// imageId: 'grape-purple',
// variety: grapeVariety.SYRAH,
// wineId: 'wine-syrah',
// })

/**
 * @property farmhand.module:items.grapeTempranillo
 * @type {farmhand.grape}
 */
export const grapeTempranillo = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-tempranillo'),
  }),
  name: 'Tempranillo Grape',
  imageId: 'grape-purple',
  variety: grapeVariety.TEMPRANILLO,
  wineId: 'wine-tempranillo',
})

/**
 * @property farmhand.module:items.grapeNebbiolo
 * @type {farmhand.grape}
 */
export const grapeNebbiolo = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-nebbiolo'),
  }),
  name: 'Nebbiolo Grape',
  imageId: 'grape-purple',
  variety: grapeVariety.NEBBIOLO,
  wineId: 'wine-nebbiolo',
})

/**
 * @type {Record<grapeVariety, farmhand.grape>}
 */
export const grapeVarietyToGrapeItemMap = {
  [grapeVariety.CHARDONNAY]: grapeChardonnay,
  [grapeVariety.SAUVIGNON_BLANC]: grapeSauvignonBlanc,
  //[grapeVariety.PINOT_BLANC]: grapePinotBlanc,
  //[grapeVariety.MUSCAT]: grapeMuscat,
  //[grapeVariety.RIESLING]: grapeRiesling,
  //[grapeVariety.MERLOT]: grapeMerlot,
  [grapeVariety.CABERNET_SAUVIGNON]: grapeCabernetSauvignon,
  //[grapeVariety.SYRAH]: grapeSyrah,
  [grapeVariety.TEMPRANILLO]: grapeTempranillo,
  [grapeVariety.NEBBIOLO]: grapeNebbiolo,
}
