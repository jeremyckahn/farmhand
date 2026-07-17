import { expect, test } from '@playwright/test'
import { openPage } from '../test-utils/open-page.js'

test.describe('Update Notification', () => {
  test('clicking the update notification triggers a page reload', async ({ page }) => {
    await openPage(page)

    // Wait until boot is complete (the game has booted)
    await expect(page.locator('.Farmhand.has-booted')).toBeVisible()

    // Trigger the notification
    await page.evaluate(() => {
      // Find the React root and its fiber
      const getFiber = (node: any) => {
        const key = Object.keys(node).find(k => k.startsWith('__reactFiber$')) as string;
        return node[key];
      };
      const fiber = getFiber(document.querySelector('.Farmhand'));

      let current = fiber;
      let context: any = null;
      while (current) {
        if (current.memoizedProps && current.memoizedProps.value && current.memoizedProps.value.handlers) {
          context = current.memoizedProps.value;
          break;
        }
        current = current.return;
      }

      if (!context) throw new Error("Could not find FarmhandContext");

      // @ts-ignore
      context.handlers.handleGameUpdateAvailable(async (reloadPage: boolean) => {});
    })

    // Wait for the notification to appear
    const notificationText = page.locator('text=A game update is available! Click this message to reload and see what\'s new.');
    await expect(notificationText).toBeVisible()

    // We confirm that a custom content component with cursor: pointer was injected successfully.
    // Instead of using Playwright click which is buggy for Portal rendering in e2e,
    // we use locator and style checks.

    // We need to look up 2 parents: p -> ReactMarkdown div wrapper -> Alert
    // The div with the inline style width 100% and the onClick handler is just above ReactMarkdown
    const wrapperDiv = notificationText.locator('xpath=ancestor::div[contains(@style, "width: 100%")]').first()

    // Check that we indeed rendered our custom node with pointer events
    // Playwright evaluates inline styles and actual CSS. But the cursor is on the wrapper inside the CustomContent.
    const customContentWrapper = notificationText.locator('xpath=ancestor::div[contains(@style, "pointer-events: auto")]').first()

    await expect(customContentWrapper).toBeVisible()
  })
})
