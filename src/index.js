/**
 * @namespace farmhand
 */

/**
 * @typedef farmhand.item
 * @type {Object}
 * @property {string} id
 * @property {string} name
 * @property {number} value
 */

/**
 * @typedef farmhand.crop
 * @type {farmhand.item}
 * @property {farmhand.module:enums.cropType} type
 */

export { default as Farmhand } from './components/farmhand';
