import fastMemoize from 'fast-memoize'

import { MEMOIZE_CACHE_CLEAR_THRESHOLD } from '../constants'

// This is basically the same as fast-memoize's default cache, except that it
// clears the cache once the size exceeds MEMOIZE_CACHE_CLEAR_THRESHOLD to
// prevent memory bloat.
// https://github.com/caiogondim/fast-memoize.js/blob/5cdfc8dde23d86b16e0104bae1b04cd447b98c63/src/index.js#L114-L128
/**
 * @ignore
 */
export class MemoizeCache {
  cache = {}

  /**
   * @param {Object} [config] Can also contain the config options used to
   * configure fast-memoize.
   * @param {number} [config.cacheSize]
   * @see https://github.com/caiogondim/fast-memoize.js
   */
  constructor({ cacheSize = MEMOIZE_CACHE_CLEAR_THRESHOLD } = {}) {
    this.cacheSize = cacheSize
  }

  has(key) {
    return key in this.cache
  }

  get(key) {
    return this.cache[key]
  }

  set(key, value) {
    if (Object.keys(this.cache).length > this.cacheSize) {
      this.cache = {}
    }

    this.cache[key] = value
  }
}

/**
 * @param {function} fn
 * @param {Object} [config]
 * @param {number} [config.cacheSize]
 * @see https://github.com/caiogondim/fast-memoize.js
 */
export const memoize = (fn, config) =>
  fastMemoize(fn, {
    cache: { create: () => new MemoizeCache(config) },
    ...config,
  })
