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
 * @param {Omit<farmhand.cropVariety, 'cropFamily'>} grapeProps
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
})
