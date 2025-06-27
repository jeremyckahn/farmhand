/**
 * @interface
 */
export class Factory {
  /**
   * @returns {farmhand.item | farmhand.item[]}
   * @abstract
   */
  generate() {}
}
