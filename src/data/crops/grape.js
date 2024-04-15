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
 * @param {Omit<farmhand.cropVariety, 'cropFamily'>} grapeProps
 * @returns {Grape}
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
 * @property farmhand.module:items.grapeChardonnay
 * @type {Grape}
 */
export const grapeChardonnay = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-chardonnay'),
  }),
  name: 'Chardonnay Grape',
  imageId: 'grape-green',
})

/**
 * @property farmhand.module:items.grapeSauvignonBlanc
 * @type {Grape}
 */
export const grapeSauvignonBlanc = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-sauvignon-blanc'),
  }),
  name: 'Sauvignon Blanc Grape',
  imageId: 'grape-green',
})

/**
 * @property farmhand.module:items.grapePinotBlanc
 * @type {Grape}
 */
// export const grapePinotBlanc = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-pinot-blanc') }),
// name: 'Pinot Blanc Grape',
// imageId: 'grape-green',
// })

/**
 * @property farmhand.module:items.grapeMuscat
 * @type {Grape}
 */
// export const grapeMuscat = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-muscat') }),
// name: 'Muscat Grape',
// imageId: 'grape-green',
// })

/**
 * @property farmhand.module:items.grapeRiesling
 * @type {Grape}
 */
// export const grapeRiesling = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-riesling') }),
// name: 'Riesling Grape',
// imageId: 'grape-green',
// })

/**
 * @property farmhand.module:items.grapeMerlot
 * @type {Grape}
 */
// export const grapeMerlot = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-merlot') }),
// name: 'Merlot Grape',
// imageId: 'grape-purple',
// })

/**
 * @property farmhand.module:items.grapeCabernetSauvignon
 * @type {Grape}
 */
export const grapeCabernetSauvignon = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-cabernet-sauvignon'),
  }),
  name: 'Cabernet Sauvignon Grape',
  imageId: 'grape-purple',
})

/**
 * @property farmhand.module:items.grapeSyrah
 * @type {Grape}
 */
// export const grapeSyrah = grape({
// ...fromSeed(grapeSeed, { variantIdx: grapeSeed.growsInto?.indexOf('grape-syrah') }),
// name: 'Syrah Grape',
// imageId: 'grape-purple',
// })

/**
 * @property farmhand.module:items.grapeTempranillo
 * @type {Grape}
 */
export const grapeTempranillo = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-tempranillo'),
  }),
  name: 'Tempranillo Grape',
  imageId: 'grape-purple',
})

/**
 * @property farmhand.module:items.grapeNebbiolo
 * @type {Grape}
 */
export const grapeNebbiolo = grape({
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf('grape-nebbiolo'),
  }),
  name: 'Nebbiolo Grape',
  imageId: 'grape-purple',
})
