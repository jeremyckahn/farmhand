import '@testing-library/jest-dom'
import 'jest-extended'
import { cleanup } from '@testing-library/react'

const localForageStore = new Map<string, any>()

const mockLocalForageInstance = {
  getItem: vitest.fn(async (key: string) => localForageStore.get(key) ?? null),
  setItem: vitest.fn(async (key: string, value: any) => {
    localForageStore.set(key, value)
    return value
  }),
  removeItem: vitest.fn(async (key: string) => {
    localForageStore.delete(key)
  }),
  clear: vitest.fn(async () => {
    localForageStore.clear()
  }),
  config: vitest.fn(),
  ready: vitest.fn(async () => {}),
}

vitest.mock('localforage', () => {
  return {
    default: {
      createInstance: vitest.fn(() => mockLocalForageInstance),
      getItem: vitest.fn(
        async (key: string) => localForageStore.get(key) ?? null
      ),
      setItem: vitest.fn(async (key: string, value: any) => {
        localForageStore.set(key, value)
        return value
      }),
      removeItem: vitest.fn(async (key: string) => {
        localForageStore.delete(key)
      }),
      clear: vitest.fn(async () => {
        localForageStore.clear()
      }),
      config: vitest.fn(),
      ready: vitest.fn(async () => {}),
    },
  }
})

beforeEach(() => {
  localForageStore.clear()
  // Return an invalid month number so that any conditional logic that depends
  // on a specific month is not run in tests (unless getMonth is re-mocked).
  vitest.spyOn(Date.prototype, 'getMonth').mockReturnValue(-1)
})

afterEach(() => {
  cleanup()
})
