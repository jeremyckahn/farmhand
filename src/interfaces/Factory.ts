/**
 * @interface
 */
export class Factory {
  /**
   * @returns
   * @abstract
   */
  generate(): farmhand.item | farmhand.item[] {
    throw new Error('generate() must be implemented by subclass')
  }
}
