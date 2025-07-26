#!/usr/bin/env node

/**
 * Validation script for Playwright E2E test setup
 * This script verifies that the Playwright configuration is working correctly
 */

import { readFileSync } from 'fs'
import { readdir } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function validateSetup() {
  console.log('🔍 Validating Playwright E2E setup...\n')

  // Check if package.json exists and has playwright dependency
  try {
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, 'package.json'), 'utf8')
    )
    if (packageJson.devDependencies?.['@playwright/test']) {
      console.log('✅ Playwright dependency found')
    } else {
      console.log('❌ Playwright dependency missing')
      return false
    }
  } catch (error) {
    console.log('❌ Could not read package.json:', error.message)
    return false
  }

  // Check if playwright.config.js exists
  try {
    const configPath = join(__dirname, 'playwright.config.js')
    readFileSync(configPath, 'utf8')
    console.log('✅ Playwright configuration file found')
  } catch (error) {
    console.log('❌ Playwright configuration file missing')
    return false
  }

  // Check if test directory exists
  try {
    const testDir = join(__dirname, 'tests')
    const testFiles = await readdir(testDir, { withFileTypes: true })
    const testCount = testFiles.filter(
      file => file.isFile() && file.name.endsWith('.test.js')
    ).length

    if (testCount > 0) {
      console.log(`✅ Found ${testCount} test files`)
    } else {
      console.log('⚠️  No test files found in tests directory')
    }
  } catch (error) {
    console.log('❌ Could not access tests directory:', error.message)
    return false
  }

  // Check if test utilities exist
  try {
    const utilsPath = join(__dirname, 'test-utils', 'open-page.js')
    readFileSync(utilsPath, 'utf8')
    console.log('✅ Test utilities found')
  } catch (error) {
    console.log('❌ Test utilities missing:', error.message)
    return false
  }

  // Try to load Playwright configuration
  try {
    const { devices } = await import('@playwright/test')
    console.log('✅ Playwright modules load successfully')
  } catch (error) {
    console.log('❌ Could not load Playwright modules:', error.message)
    return false
  }

  // Check environment configuration
  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  console.log(`✅ App URL configured: ${appUrl}`)

  console.log('\n🎉 Playwright E2E setup validation complete!')
  console.log('\nNext steps:')
  console.log('1. Start the development server: npm run dev')
  console.log('2. Install browsers: npm run e2e:install')
  console.log('3. Run tests: npm run e2e:test')

  return true
}

// Run validation if this script is executed directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  validateSetup().catch(error => {
    console.error('❌ Validation failed:', error.message)
    process.exit(1)
  })
}

export { validateSetup }
