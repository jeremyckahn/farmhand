const puppeteer = require('puppeteer') // v23.0.0 or later

;(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Running headless is typical for CI
    args: [
      '--no-sandbox', // Required in Docker environments without a user namespace
      '--disable-setuid-sandbox', // Same as above
      '--disable-dev-shm-usage', // Overcomes limited resource problems
      // '--remote-debugging-port=9222', // Optional: for debugging
      // '--remote-debugging-address=0.0.0.0' // Optional: for debugging
    ],
    executablePath: puppeteer.executablePath(), // Ensure it uses the bundled Chromium
  })
  const page = await browser.newPage()
  const timeout = 5000
  page.setDefaultTimeout(timeout)

  {
    const targetPage = page
    await targetPage.setViewport({
      width: 759,
      height: 883,
    })
  }
  {
    const targetPage = page

    const APP_URL = process.env.APP_URL || 'http://localhost:3000' // Fallback for local testing outside Docker
    await targetPage.goto(`${APP_URL}?seed=0.5`)
  }

  {
    const targetPage = page

    try {
      await puppeteer.Locator.race([
        targetPage.locator('#root > div > button path'),
      ])
        .setTimeout(timeout)
        .click({
          offset: {
            x: 15.5,
            y: 6,
          },
        })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  await browser.close()
})().catch(err => {
  console.error(err)
  process.exit(1)
})
