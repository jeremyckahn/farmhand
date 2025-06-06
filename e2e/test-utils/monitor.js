/**
 * Helper class for debugging tests.
 */
export class Monitor {
  /**
   * @param {import('@playwright/test').Page} page
   */
  static logs = page => {
    page.on('console', msg => {
      if (msg.type() === 'log') console.log(`Log text: "${msg.text()}"`)
      if (msg.type() === 'error') console.log(`Error text: "${msg.text()}"`)
    })
  }

  /**
   * @param {import('@playwright/test').Page} page
   */
  static network = page => {
    page.on('request', request =>
      console.log('>>', request.method(), request.url())
    )
    page.on('response', async response =>
      console.log('<<', response.status(), await response.text())
    )
  }
}
