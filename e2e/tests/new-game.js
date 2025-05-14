import { expect } from 'expect'
import { getDocument, queries } from 'pptr-testing-library'
import puppeteer from 'puppeteer'

const { getByText } = queries

// FIXME: Running the E2E tests seems to create an empty package.json file

// prettier-disable
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
    const $document = await getDocument(page)

    await targetPage
      .locator('#root > div > button path')
      .setTimeout(timeout)
      .click({
        offset: {
          x: 15.5,
          y: 6,
        },
      })

    await getByText($document, 'Your loan balance has grown to', {
      exact: false,
    })

    await targetPage.reload()
  }

  {
    const $document = await getDocument(page)

    // FIXME: This should not be necessary, but it seems to make the following assertion succeed
    await getByText($document, 'Day 2', {
      exact: false,
    })

    const notification = await getByText(
      $document,
      'Your loan balance has grown to',
      {
        exact: false,
      }
    )

    expect(notification).toBeTruthy()
  }

  await browser.close()
})().catch(err => {
  console.error(err)
  process.exit(1)
})
