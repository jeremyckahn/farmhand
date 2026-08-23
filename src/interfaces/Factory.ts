/**
 * @interface
 */
export abstract class Factory implements farmhand.Factory {
  /**
   * @abstract
   */
  abstract generate(): farmhand.item | farmhand.item[] | null
}

declare global {
  namespace farmhand {
    // eslint-disable-next-line no-shadow
    interface Factory {
      generate(): item | item[] | null
    }
  }
}
