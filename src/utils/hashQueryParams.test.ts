import {
  getHashQueryParams,
  removeHashQueryParam,
  setHashQueryParam,
} from './hashQueryParams.js'

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

  describe('removeHashQueryParam', () => {
    test('removes the given key, leaving other params intact', () => {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}#?view=SHOP&tab=Upgrades`
      )

      removeHashQueryParam('tab')

      const params = getHashQueryParams()

      expect(params.get('view')).toEqual('SHOP')
      expect(params.has('tab')).toEqual(false)
    })

    test('drops the "?" entirely when removing the last param', () => {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}#online/my-room?tab=Upgrades`
      )

      removeHashQueryParam('tab')

      expect(window.location.hash).toEqual('#online/my-room')
    })

    test('is a no-op when the key is not present', () => {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}#?view=SHOP`
      )

      removeHashQueryParam('tab')

      expect(window.location.hash).toEqual('#?view=SHOP')
    })
  })
})
