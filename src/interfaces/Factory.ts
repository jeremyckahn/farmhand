/**
 * @interface
 */
export class Factory {
  /**
   * @returns {farmhand.item | farmhand.item[]}
   * @abstract
   */
  generate() {
    throw new Error('generate() must be implemented by subclass')
  }
}
