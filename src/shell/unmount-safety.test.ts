import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'
import { waitForBoot } from '../test-utils/ui.js'

// Regression coverage for the isMounted guard added to the post-increment-day
// effect in useFarmhand.ts. Before that guard existed, unmounting while an
// incrementDay's persistence promise was still in flight could run the
// effect's continuation (further setState calls and notifications) against a
// torn-down instance. This forces that race by holding the persistence
// promise open across an unmount, then resolving it afterward.
describe('unmount safety', () => {
  test('does not error or leave a pending rejection when unmounted mid-incrementDay', async () => {
    let resolveSetItem: (value?: unknown) => void = () => {}
    const setItemPromise = new Promise(resolve => {
      resolveSetItem = resolve
    })

    const { unmount } = await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(null),
        setItem: (_key: string, data: unknown) =>
          setItemPromise.then(() => data),
      },
    })

    // The fresh-game boot path calls incrementDay(true), which schedules the
    // post-increment-day effect. By the time "Day 1" renders, that effect's
    // async continuation is already awaiting localforage.setItem (the mock
    // above), i.e. it's suspended exactly where the isMounted guard matters.
    await waitForBoot()

    const consoleError = vitest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    unmount()

    resolveSetItem()

    // Flush the now-resolved promise's continuation (the effect's `try`/
    // `finally` body) so any errors it throws surface within this test.
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(consoleError).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })
})
