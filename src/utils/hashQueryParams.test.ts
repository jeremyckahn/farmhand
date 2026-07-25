import { getHashQueryParams, setHashQueryParam } from './hashQueryParams.js'

describe('hashQueryParams', () => {
  afterEach(() => {
    window.history.replaceState({}, '', `${window.location.pathname}`)
  })

  describe('getHashQueryParams', () => {
    test('returns an empty URLSearchParams when there is no hash', () => {
      window.history.replaceState({}, '', `${window.location.pathname}`)

      expect(getHashQueryParams().toString()).toEqual('')
    })

    test('parses query params from the hash', () => {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}#?view=SHOP&tab=Upgrades`
      )

      const params = getHashQueryParams()

      expect(params.get('view')).toEqual('SHOP')
      expect(params.get('tab')).toEqual('Upgrades')
    })

    test('parses query params from a hash with a router path prefix', () => {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}#online/my-room?view=FIELD`
      )

      expect(getHashQueryParams().get('view')).toEqual('FIELD')
    })
  })

  describe('setHashQueryParam', () => {
    test('adds a query param to an empty hash', () => {
      window.history.replaceState({}, '', `${window.location.pathname}`)

      setHashQueryParam('view', 'SHOP')

      expect(window.location.hash).toEqual('#?view=SHOP')
    })

    test('preserves the hash path prefix', () => {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}#online/my-room`
      )

      setHashQueryParam('view', 'SHOP')

      expect(window.location.hash).toEqual('#online/my-room?view=SHOP')
    })

    test('preserves other existing query params', () => {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}#?tab=Upgrades`
      )

      setHashQueryParam('view', 'SHOP')

      const params = getHashQueryParams()

      expect(params.get('view')).toEqual('SHOP')
      expect(params.get('tab')).toEqual('Upgrades')
    })

    test('overwrites an existing value for the same key', () => {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}#?view=SHOP`
      )

      setHashQueryParam('view', 'FIELD')

      expect(getHashQueryParams().get('view')).toEqual('FIELD')
    })
  })
})
