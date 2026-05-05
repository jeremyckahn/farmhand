/**
 * @interface
 */
export class Factory {
  /**
   * @returns {farmhand.item | farmhand.item[]}
   * @abstract
   */
  generate(): farmhand.item | farmhand.item[] {
    throw new Error('generate() must be implemented by subclass')
  }
}
