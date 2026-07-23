import { expect, test } from '@playwright/test'
import { openPage } from '../test-utils/open-page.js'

test.describe('Update Notification', () => {
  test('clicking the update notification triggers a page reload', async ({
    page,
  }) => {
    await openPage(page)

    await expect(page.locator('.Farmhand.has-booted')).toBeVisible()

    // There is no UI-driven way to make the app think a game update is
    // available, so this reaches into the React tree to invoke the handler
    // directly, passing a mock updateServiceWorker that mimics the real
    // implementation's reload-on-true behavior.
    await page.evaluate(() => {
      const getFiber = (node: Element) => {
        const key = Object.keys(node).find(k => k.startsWith('__reactFiber$'))
        return ((node as unknown) as Record<string, any>)[key as string]
      }

      let fiber = getFiber(document.querySelector('.Farmhand')!)
      let context: any = null

      while (fiber) {
        if (fiber.memoizedProps?.value?.handlers) {
          context = fiber.memoizedProps.value
          break
        }

        fiber = fiber.return
      }

      if (!context) {
        throw new Error('Could not find FarmhandContext')
      }

      context.handlers.handleGameUpdateAvailable(
        async (reloadPage?: boolean) => {
          if (reloadPage) {
            window.location.reload()
          }
        }
      )
    })

    const notification = page.getByText(
      "A game update is available! Click this message to reload and see what's new."
    )
    await expect(notification).toBeVisible()

    await Promise.all([page.waitForEvent('load'), notification.click()])

    // If the page didn't actually reload, the app would still be showing the
    // old notification instead of rebooting fresh.
    await expect(page.locator('.Farmhand.has-booted')).toBeVisible()
    await expect(notification).not.toBeVisible()
  })
})
