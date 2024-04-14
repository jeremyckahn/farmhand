/** @typedef {import("../../index").farmhand.item} farmhand.item */
/** @typedef {import("../../index").farmhand.cropVariety} farmhand.cropVariety */

import { crop, fromSeed, cropVariety } from '../crop'
import { cropFamily, cropType } from '../../enums'

/**
 * @typedef {cropVariety & {
 *   cropFamily: cropFamily['GRAPE']
 * }} Grape
 */

/**
 * @param {farmhand.item | farmhand.cropVariety} item
 * @returns {item is Grape}
 */
export const isGrape = item => {
  return 'cropFamily' in item && item.cropFamily === cropFamily.GRAPE
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
 * @property farmhand.module:items.grapeChardonnay
 * @type {farmhand.cropVariety}
 */
export const grapeChardonnay = cropVariety({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-chardonnay'),
  }),
  name: 'Chardonnay Grape',
  imageId: 'grape-green',
  cropFamily: cropFamily.GRAPE,
})

/**
 * @property farmhand.module:items.grapeSauvignonBlanc
 * @type {farmhand.cropVariety}
 */
export const grapeSauvignonBlanc = cropVariety({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-sauvignon-blanc'),
  }),
  name: 'Sauvignon Blanc Grape',
  imageId: 'grape-green',
  cropFamily: cropFamily.GRAPE,
})

/**
 * @property farmhand.module:items.grapePinotBlanc
 * @type {farmhand.cropVariety}
 */
// export const grapePinotBlanc = cropVariety({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-pinot-blanc') }),
// name: 'Pinot Blanc Grape',
// imageId: 'grape-green',
// cropFamily: cropFamily.GRAPE,
// })

/**
 * @property farmhand.module:items.grapeMuscat
 * @type {farmhand.cropVariety}
 */
// export const grapeMuscat = cropVariety({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-muscat') }),
// name: 'Muscat Grape',
// imageId: 'grape-green',
// cropFamily: cropFamily.GRAPE,
// })

/**
 * @property farmhand.module:items.grapeRiesling
 * @type {farmhand.cropVariety}
 */
// export const grapeRiesling = cropVariety({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-riesling') }),
// name: 'Riesling Grape',
// imageId: 'grape-green',
// })

/**
 * @property farmhand.module:items.grapeMerlot
 * @type {farmhand.cropVariety}
 */
// export const grapeMerlot = cropVariety({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-merlot') }),
// name: 'Merlot Grape',
// imageId: 'grape-purple',
// cropFamily: cropFamily.GRAPE,
// })

/**
 * @property farmhand.module:items.grapeCabernetSauvignon
 * @type {farmhand.cropVariety}
 */
export const grapeCabernetSauvignon = cropVariety({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-cabernet-sauvignon'),
  }),
  name: 'Cabernet Sauvignon Grape',
  imageId: 'grape-purple',
  cropFamily: cropFamily.GRAPE,
})

/**
 * @property farmhand.module:items.grapeSyrah
 * @type {farmhand.cropVariety}
 */
// export const grapeSyrah = cropVariety({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-syrah') }),
// name: 'Syrah Grape',
// imageId: 'grape-purple',
// cropFamily: cropFamily.GRAPE,
// })

/**
 * @property farmhand.module:items.grapeTempranillo
 * @type {farmhand.cropVariety}
 */
export const grapeTempranillo = cropVariety({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-tempranillo'),
  }),
  name: 'Tempranillo Grape',
  imageId: 'grape-purple',
  cropFamily: cropFamily.GRAPE,
})

/**
 * @property farmhand.module:items.grapeNebbiolo
 * @type {farmhand.cropVariety}
 */
export const grapeNebbiolo = cropVariety({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-nebbiolo'),
  }),
  name: 'Nebbiolo Grape',
  imageId: 'grape-purple',
  cropFamily: cropFamily.GRAPE,
})
