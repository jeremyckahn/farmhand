import { within } from '@testing-library/dom'

import { saveFileStubFactory } from '../test-utils/stubs/saveFileStubFactory'
import { farmhandStub } from '../test-utils/stubs/farmhandStub'
import { nextView, previousView } from '../test-utils/ui'

describe('navigation', () => {
  test('cycles forwards through the standard views', async () => {
    await farmhandStub()
    const [header] = document.getElementsByTagName('header')

    for (const viewName of ['Shop', 'Field', 'Workshop', 'Home']) {
      await nextView()
      within(header).getByText(viewName)
    }
  })

  test('cycles backwards through the standard views', async () => {
    await farmhandStub()
    const [header] = document.getElementsByTagName('header')

    for (const viewName of ['Workshop', 'Field', 'Shop', 'Home']) {
      await previousView()
      within(header).getByText(viewName)
    }
  })

  test('cycles forwards through the unlocked views', async () => {
    const loadedState = saveFileStubFactory({
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
      within(header).getByText(viewName)
    }
  })

  test('cycles backwards through the unlocked views', async () => {
    const loadedState = saveFileStubFactory({
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
      within(header).getByText(viewName)
    }
  })
})
