/**
 * @interface
 */
export abstract class Factory implements farmhand.Factory {
  /**
   * @abstract
   */
  abstract generate(): farmhand.item | farmhand.item[] | null
}
