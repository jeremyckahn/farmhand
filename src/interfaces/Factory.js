/** @typedef {import("../index").farmhand.item} farmhand.item */

/**
 * @interface
 */
export class Factory {
  /**
   * @returns {farmhand.item}
   * @abstract
   */
  generate() {}
}
