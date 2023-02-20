/** @typedef {import("../../index").farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.grapeSeed
 * @type {farmhand.item}
 */
export const grapeSeed = crop({
  cropType: cropType.GRAPE,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 4,
  },
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
 * @type {farmhand.item}
 */
export const grapeChardonnay = crop({
  ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-chardonnay')),
  name: 'Chardonnay Grape',
})

/**
 * @property farmhand.module:items.grapeSauvignonBlanc
 * @type {farmhand.item}
 */
export const grapeSauvignonBlanc = crop({
  ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-sauvignon-blanc')),
  name: 'Sauvignon Blanc Grape',
})

/**
 * @property farmhand.module:items.grapePinotBlanc
 * @type {farmhand.item}
 */
// export const grapePinotBlanc = crop({
// ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-pinot-blanc')),
// name: 'Pinot Blanc Grape',
// })

/**
 * @property farmhand.module:items.grapeMuscat
 * @type {farmhand.item}
 */
// export const grapeMuscat = crop({
// ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-muscat')),
// name: 'Muscat Grape',
// })

/**
 * @property farmhand.module:items.grapeRiesling
 * @type {farmhand.item}
 */
// export const grapeRiesling = crop({
// ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-riesling')),
// name: 'Riesling Grape',
// })

/**
 * @property farmhand.module:items.grapeMerlot
 * @type {farmhand.item}
 */
// export const grapeMerlot = crop({
// ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-merlot')),
// name: 'Merlot Grape',
// })

/**
 * @property farmhand.module:items.grapeCabernetSauvignon
 * @type {farmhand.item}
 */
export const grapeCabernetSauvignon = crop({
  ...fromSeed(
    grapeSeed,
    grapeSeed.growsInto.indexOf('grape-cabernet-sauvignon')
  ),
  name: 'Cabernet Sauvignon Grape',
})

/**
 * @property farmhand.module:items.grapeSyrah
 * @type {farmhand.item}
 */
// export const grapeSyrah = crop({
// ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-syrah')),
// name: 'Syrah Grape',
// })

/**
 * @property farmhand.module:items.grapeTempranillo
 * @type {farmhand.item}
 */
export const grapeTempranillo = crop({
  ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-tempranillo')),
  name: 'Tempranillo Grape',
})

/**
 * @property farmhand.module:items.grapeNebbiolo
 * @type {farmhand.item}
 */
export const grapeNebbiolo = crop({
  ...fromSeed(grapeSeed, grapeSeed.growsInto.indexOf('grape-nebbiolo')),
  name: 'Nebbiolo Grape',
})
