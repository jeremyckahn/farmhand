#!/usr/bin/env node

/**
 * First-time setup script for Playwright E2E tests
 * This script automates the initial setup process for running E2E tests
 */

import { execSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m', // cyan
    success: '\x1b[32m', // green
    warning: '\x1b[33m', // yellow
    error: '\x1b[31m', // red
    reset: '\x1b[0m',
  }

  const prefix = {
    info: 'ℹ️ ',
    success: '✅ ',
    warning: '⚠️ ',
    error: '❌ ',
  }

  console.log(`${colors[type]}${prefix[type]}${message}${colors.reset}`)
}

function execute(command, description) {
  try {
    log(`${description}...`, 'info')
    execSync(command, { stdio: 'inherit' })
    log(`${description} completed successfully`, 'success')
    return true
  } catch (error) {
    log(`${description} failed: ${error.message}`, 'error')
    return false
  }
}

async function checkPrerequisites() {
  log('Checking prerequisites...', 'info')

  // Check Node.js version
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim()
    log(`Node.js version: ${nodeVersion}`, 'success')
  } catch (error) {
    log('Node.js is not installed or not accessible', 'error')
    return false
  }

  // Check npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim()
    log(`npm version: ${npmVersion}`, 'success')
  } catch (error) {
    log('npm is not installed or not accessible', 'error')
    return false
  }

  // Check if main project dependencies are installed
  try {
    const mainPackageJsonPath = join(__dirname, '..', 'package.json')
    const nodeModulesPath = join(__dirname, '..', 'node_modules')

    try {
      execSync(`test -d "${nodeModulesPath}"`, { stdio: 'ignore' })
      log('Main project dependencies are installed', 'success')
    } catch {
      log('Main project dependencies are not installed', 'warning')
      log(
        'Please run "npm ci --legacy-peer-deps" in the main project directory first',
        'warning'
      )
      return false
    }
  } catch (error) {
    log('Could not check main project dependencies', 'error')
    return false
  }

  return true
}

async function setupE2E() {
  log('\n🚀 Setting up Playwright E2E tests for Farmhand\n', 'info')

  // Check prerequisites
  if (!(await checkPrerequisites())) {
    log(
      '\nPrerequisites check failed. Please fix the issues above and try again.',
      'error'
    )
    process.exit(1)
  }

  // Install E2E dependencies
  log('\nInstalling E2E dependencies...', 'info')
  if (!execute('npm install', 'Installing E2E dependencies')) {
    log('Failed to install E2E dependencies', 'error')
    process.exit(1)
  }

  // Install Playwright browsers
  log('\nInstalling Playwright browsers...', 'info')
  if (!execute('npx playwright install', 'Installing Playwright browsers')) {
    log('Failed to install Playwright browsers', 'error')
    process.exit(1)
  }

  // Validate setup
  log('\nValidating setup...', 'info')
  if (!execute('npm run validate', 'Validating setup')) {
    log('Setup validation failed', 'error')
    process.exit(1)
  }

  // Success message
  log('\n🎉 E2E test setup completed successfully!\n', 'success')

  // Next steps
  console.log('Next steps:')
  console.log('1. Start the development server in the main project:')
  console.log('   cd .. && npm run dev')
  console.log('')
  console.log('2. In a separate terminal, run the E2E tests:')
  console.log('   npm test                    # Run all tests')
  console.log('   npm run test:headed         # Run with browser UI')
  console.log('   npm run test:debug          # Debug mode')
  console.log('   npm run test:ui             # Interactive UI')
  console.log('')
  console.log('3. Or run from the main project directory:')
  console.log('   npm run e2e:test            # Run all tests')
  console.log('   npm run e2e:test:headed     # Run with browser UI')
  console.log('   npm run e2e:test:debug      # Debug mode')
  console.log('   npm run e2e:test:ui         # Interactive UI')
  console.log('')
  console.log('For more information, see the README.md file.')
}

// Run setup if this script is executed directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  setupE2E().catch(error => {
    log(`Setup failed: ${error.message}`, 'error')
    process.exit(1)
  })
}

export { setupE2E }
