import globalWindow from 'global/window.js'

// The app is served behind a HashRouter (see src/index.tsx), which owns
// everything after "#" for its own path-based routing (e.g.
// "#online/my-room"). These helpers append/read a query string on that
// same hash, after any router path, so persisted UI state (e.g. the
// current view) round-trips through a reload without going through
// react-router's history/location - which requires a <Router> ancestor
// that isn't present in every test/render context this is used from.
const splitHash = () => {
  const hash = globalWindow.location.hash.replace(/^#/, '')
  const queryIndex = hash.indexOf('?')

  return queryIndex === -1
    ? { path: hash, query: '' }
    : { path: hash.slice(0, queryIndex), query: hash.slice(queryIndex + 1) }
}

export const getHashQueryParams = (): URLSearchParams =>
  new URLSearchParams(splitHash().query)

export const setHashQueryParam = (key: string, value: string): void => {
  const { path } = splitHash()
  const params = getHashQueryParams()

  params.set(key, value)

  const queryString = params.toString()
  const newHash = `${path}${queryString ? `?${queryString}` : ''}`
  const { origin, pathname, search } = globalWindow.location

  globalWindow.history.replaceState(
    {},
    '',
    `${origin}${pathname}${search}#${newHash}`
  )
}
