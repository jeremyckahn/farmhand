import 'jest-extended'

// Conditionally import DOM matchers and React cleanup only when running in a
// browser/JSDOM environment. Keeping them out of Node-based test runners avoids
// loading heavy React and DOM libraries into pure logic test workers.
if (typeof window !== 'undefined') {
  await import('@testing-library/jest-dom')
  const { cleanup } = await import('@testing-library/react')

  afterEach(() => {
    cleanup()
    // Farmhand mirrors navigation state (current view, tabbed screens' active
    // tab) into the real window.location.hash (see src/utils/hashQueryParams.ts),
    // which - unlike React/component state - isn't reset between tests on its
    // own and would otherwise leak into whichever test runs next in the same
    // file.
    window.history.replaceState({}, '', window.location.pathname)
  })
}

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
