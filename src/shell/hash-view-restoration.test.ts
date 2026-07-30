import { waitFor, within } from '@testing-library/react'

import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory.js'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'

describe('restoring stageFocus from the URL hash on boot', () => {
  const getHeader = () => {
    const [header] = Array.from(document.getElementsByTagName('header'))

    return header
  }

  test('restores a view named in the URL hash when a fresh game has it unlocked', async () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=FIELD`
    )

    await farmhandStub()

    await waitFor(() => {
      expect(within(getHeader()).getByText('Field')).toBeInTheDocument()
    })
  })

  test('falls back to Home when a fresh game does not have the hash view unlocked', async () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=FOREST`
    )

    await farmhandStub()

    await waitFor(() => {
      expect(within(getHeader()).getByText('Home')).toBeInTheDocument()
    })
    expect(within(getHeader()).queryByText('Forest')).not.toBeInTheDocument()
  })

  test('falls back to Home when the loaded save does not have the hash view unlocked', async () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=FOREST`
    )

    const loadedState = saveDataStubFactory({
      experience: 0,
      purchasedForest: 0,
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key: string, data: unknown) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      expect(within(getHeader()).getByText('Home')).toBeInTheDocument()
    })
    expect(within(getHeader()).queryByText('Forest')).not.toBeInTheDocument()
  })

  test('restores the hash view when the loaded save does have it unlocked', async () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?view=FOREST`
    )

    const loadedState = saveDataStubFactory({
      experience: 20_000,
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key: string, data: unknown) => Promise.resolve(data),
      },
    })

    await waitFor(() => {
      expect(within(getHeader()).getByText('Forest')).toBeInTheDocument()
    })
  })
})
