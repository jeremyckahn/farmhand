/**
 * @namespace farmhand
 */

/**
 * @typedef farmhand.item
 * @type {Object}
 * @property {string} name
 * @property {string} id
 */

/**
 * @typedef farmhand.crop
 * @type {farmhand.item}
 * @property {farmhand.module:enums.cropType} type
 */

export { default as Farmhand } from './components/farmhand';
