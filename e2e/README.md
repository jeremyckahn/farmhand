# Farmhand E2E Tests

This directory contains end-to-end tests for Farmhand using [Playwright](https://playwright.dev/).

## Overview

The E2E tests verify that the game works correctly from a user's perspective by simulating real browser interactions. Tests cover core game functionality including:

- New game initialization
- Crop planting and harvesting
- Save/load functionality
- Price events and fluctuations
- Multiplayer features
- Game statistics

## Running Tests

### Prerequisites

1. Install dependencies in the main project:

   ```bash
   cd .. && npm ci --legacy-peer-deps
   ```

2. Install Playwright browsers (only needed once):

   ```bash
   npm run test:install
   ```

### Quick Setup Guide

**Option 1: Automated Setup (Recommended for first-time users)**

```bash
# 1. Run the automated setup (installs dependencies and browsers)
npm run setup

# 2. Start the Redis services (from the project root directory)
cd ..
docker compose up -d

# 3. Run the tests (from the e2e directory)
cd e2e
npm run test
```

**Option 2: Manual Setup**

If you prefer to set things up manually:

```bash
# 1. Validate the setup (optional but recommended)
npm run validate

# 2. Start the Redis services (from the project root directory)
cd ..
docker compose up -d

# 3. Install Playwright browsers (in the e2e directory, only needed once)
cd e2e
npm run test:install

# 4. Run the tests
npm run test
```

### Running Tests Locally with Playwright

The E2E tests run on a dedicated stack with dedicated ports (3002 for frontend, 3003 for API, and 8002 for tracker). Playwright automatically spins up and tears down this stack between test runs, so you do not need to manually start the development servers.

**Prerequisites:**

- Node.js and npm installed
- The main Farmhand dependencies installed (`npm ci --legacy-peer-deps`)
- Redis services running (`docker compose up -d` in the root project directory)

**Steps:**

1. **Validate the setup** (optional but recommended):

   ```bash
   npm run validate
   ```

2. **Install Playwright browsers** (only needed the first time):

   ```bash
   npm run test:install
   ```

3. **Run the E2E tests**:

   ```bash
   npm run test
   ```

### Available Test Commands

All commands should be run from the e2e directory:

- `npm run setup` - Automated first-time setup (installs dependencies and browsers)
- `npm run validate` - Validate the E2E test setup
- `npm run test` - Run all tests in headless mode
- `npm run test:headed` - Run tests with browser UI visible
- `npm run test:debug` - Run tests in debug mode (step through tests)
- `npm run test:ui` - Run tests with Playwright's interactive UI
- `npm run test:report` - View the test report from the last run
- `npm run test:install` - Install Playwright browsers

## Directory Structure

```
e2e/
├── tests/               # Test files
│   ├── *.test.js        # Individual test files
│   ├── combine-harvester/
│   ├── multiplayer/
│   ├── save-data/
│   └── stats/
├── test-utils/          # Shared test utilities
│   └── open-page.js     # Helper for opening the game
├── fixtures/            # Test data and assets
├── test-results/        # Test output (generated)
├── playwright.config.js # Playwright configuration
└── package.json         # E2E-specific dependencies
```

## Writing New Tests

### Basic Test Structure

```javascript
import { expect, test } from '@playwright/test'
import { openPage } from '../test-utils/open-page.js'

test('describe what the test does', async ({ page }) => {
  await openPage(page)

  // Your test code here
  await expect(page.getByText('Expected text')).toBeVisible()
})
```

### Test Utilities

- `openPage(page, seed)` - Opens the game with an optional seed for deterministic testing
- `loadFixture(page, fixtureName)` - Loads the game with a deterministic, predefined state to test against
- The game URL is configurable via the `APP_URL` environment variable (defaults to `http://localhost:3002`)

### Test Organization

- Put related tests in subdirectories under `tests/`
- Use descriptive file names ending in `.test.js`
- Group related functionality together
- Add shared utilities to `test-utils/`

### Authoring New E2E Tests

Run this script to launch the [Playwright codegen tools](https://playwright.dev/docs/codegen-intro):

```bash
# Assumes you already have `npm run dev` running (from the project root)
# Run this from the e2e directory
npx playwright codegen localhost:3000?seed=0.5
```

## Configuration

The Playwright configuration is in `playwright.config.js` and includes:

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari (only Chromium is enabled by default)
- **Parallel execution**: Tests run in parallel for faster execution
- **Retries**: Automatic retry on CI environments
- **Screenshots**: Captured on test failure
- **Video recording**: Retained on test failure
- **Trace collection**: Available for debugging failed tests

### Environment Variables

- `APP_URL` - The base URL for the application (default: `http://localhost:3002`)
- `CI` - Enables CI-specific settings when set

## Debugging Tests

### Debug Mode

```bash
npm run test:debug
```

This opens the Playwright Inspector where you can step through tests line by line.

### Interactive UI

```bash
npm run test:ui
```

This opens Playwright's test runner UI where you can run tests interactively and see live results.

### Screenshots and Videos

Failed tests automatically capture screenshots and videos in the `test-results/` directory.

### Trace Viewer

If a test fails and retries, a trace is collected. You can view it using:

```bash
npx playwright show-trace test-results/path-to-trace.zip
```

## Common Issues

### Port Already in Use

If you get port errors, make sure the ports (3002, 3003, and 8002) are not occupied by other processes.

### Browser Installation

If browsers aren't installed, run:

```bash
npm run test:install
```

### Test Timeouts

Tests have default timeouts. For slower operations, you can increase them:

```javascript
test('slow operation', async ({ page }) => {
  test.setTimeout(60000) // 60 seconds
  // test code
})
```

## CI Integration

Tests run automatically in GitHub Actions on every push. The CI environment:

- Runs tests with retries enabled
- Generates test reports and artifacts

For more details, see the main project's CI workflow configuration.

## Troubleshooting

### Common Issues and Solutions

#### "Port 3002 is already in use"

Make sure the ports 3002, 3003, and 8002 are not occupied by other processes.

If port 3002 is occupied by another process, you can change the port:

```bash
# Set a different port
APP_URL=http://localhost:3005 npm run test
```

#### "Playwright browsers not found"

Install the browsers:

```bash
npm run test:install
```

#### "Cannot connect to <http://localhost:3002>"

- Ensure the E2E services are starting successfully
- Check that the servers are listening on the correct ports
- Verify no firewall is blocking the connection
- Try accessing the URL manually in your browser

#### "Tests are failing unexpectedly"

1. **Check the development server logs** for errors
2. **Run tests with headed mode** to see what's happening:

   ```bash
   npm run test:headed
   ```

3. **Use debug mode** to step through the test:

   ```bash
   npm run test:debug
   ```

4. **Check for timing issues** - the game might need more time to load:

   ```javascript
   // In your test, add explicit waits
   await page.waitForLoadState('networkidle')
   ```

5. **Ensure Vercel is set up properly** - at this time, you need to have the local Farmhand project properly linked to a Vercel project. This will be improved in a future iteration.

#### "Permission denied" errors

On Linux/Mac, ensure proper permissions:

```bash
chmod -R 755 test-results/
chmod -R 755 playwright-report/
```

#### "Module not found" errors

- Ensure you're in the correct directory (`e2e/`)
- Reinstall dependencies:

  ```bash
  npm install
  ```

- Check that the main project dependencies are installed

#### "Tests run but nothing happens"

- Verify the game loads correctly at <http://localhost:3002>
- Check browser console for JavaScript errors
- Ensure the test selectors match the current UI

### Getting Help

If you encounter issues not covered here:

1. Check the [Playwright documentation](https://playwright.dev/docs/intro)
2. Look at existing test files for examples
3. Run `npm run validate` to check your setup
4. Open a GitHub issue with details about your problem
