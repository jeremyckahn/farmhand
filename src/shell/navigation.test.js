import { within } from '@testing-library/dom'

import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory.js'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'
import { nextView, previousView } from '../test-utils/ui.js'

describe('navigation', () => {
  test('cycles forwards through the standard views', async () => {
    await farmhandStub()
    const [header] = document.getElementsByTagName('header')

    for (const viewName of ['Shop', 'Field', 'Workshop', 'Home']) {
      await nextView()
      expect(within(header).getByText(viewName)).toBeInTheDocument()
    }
  })

  test('cycles backwards through the standard views', async () => {
    await farmhandStub()
    const [header] = document.getElementsByTagName('header')

    for (const viewName of ['Workshop', 'Field', 'Shop', 'Home']) {
      await previousView()
      expect(within(header).getByText(viewName)).toBeInTheDocument()
    }
  })

  test('cycles forwards through the unlocked views', async () => {
    const loadedState = saveDataStubFactory({
      purchasedCowPen: 1,
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    const [header] = document.getElementsByTagName('header')

    for (const viewName of ['Shop', 'Field', 'Cows', 'Workshop', 'Home']) {
      await nextView()
      expect(within(header).getByText(viewName)).toBeInTheDocument()
    }
  })

  test('cycles backwards through the unlocked views', async () => {
    const loadedState = saveDataStubFactory({
      purchasedCowPen: 1,
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    const [header] = document.getElementsByTagName('header')

    for (const viewName of ['Workshop', 'Cows', 'Field', 'Shop', 'Home']) {
      await previousView()
      expect(within(header).getByText(viewName)).toBeInTheDocument()
    }
  })
})
